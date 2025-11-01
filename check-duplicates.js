#!/usr/bin/env node

/**
 * Script de vérification des doublons d'import et de déclarations TypeScript
 * pour le projet Synrgy
 */

import { readdir, readFile, stat } from 'fs/promises';
import { join, extname } from 'path';

// Couleurs pour la console
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// Compteurs globaux
let totalFiles = 0;
let filesWithDuplicates = 0;
let totalDuplicates = 0;
const duplicates = [];

// Extensions de fichiers à vérifier
const fileExtensions = ['.ts', '.tsx', '.js', '.jsx'];

// Patterns regex pour détecter les imports et déclarations
const patterns = {
  import: /^import\s+(?:(?:\{[^}]+\}|[\w*]+)(?:\s+as\s+[\w]+)?\s*,?\s*)+\s+from\s+['"]([^'"]+)['"]/gm,
  importDefault: /^import\s+(\w+)\s+from\s+['"]([^'"]+)['"]/gm,
  importNamed: /^import\s+\{([^}]+)\}\s+from\s+['"]([^'"]+)['"]/gm,
  importType: /^import\s+type\s+([\w\s,{}\*]+)\s+from\s+['"]([^'"]+)['"]/gm,
  function: /^(?:export\s+)?function\s+(\w+)/gm,
  const: /^(?:export\s+)?const\s+(\w+)\s*=/gm,
  let: /^(?:export\s+)?let\s+(\w+)\s*=/gm,
  var: /^(?:export\s+)?var\s+(\w+)\s*=/gm,
  class: /^(?:export\s+)?class\s+(\w+)/gm,
  interface: /^(?:export\s+)?interface\s+(\w+)/gm,
  type: /^type\s+(\w+)\s*=/gm,
  enum: /^(?:export\s+)?enum\s+(\w+)/gm,
};

/**
 * Lit récursivement tous les fichiers d'un répertoire
 */
async function getAllFiles(dir, fileList = []) {
  const files = await readdir(dir);
  
  for (const file of files) {
    const filePath = join(dir, file);
    const fileStat = await stat(filePath);
    
    // Ignorer node_modules, .git, dist, build
    if (file.includes('node_modules') || file.includes('.git') || 
        file.includes('dist') || file.includes('build') || 
        file.startsWith('.')) {
      continue;
    }
    
    if (fileStat.isDirectory()) {
      await getAllFiles(filePath, fileList);
    } else if (fileExtensions.includes(extname(file))) {
      fileList.push(filePath);
    }
  }
  
  return fileList;
}

/**
 * Analyse un fichier pour détecter les doublons
 */
function analyzeFile(content, filePath) {
  const issues = [];
  
  // Extraire les imports
  const imports = [];
  let match;
  
  // Imports par défaut
  while ((match = patterns.importDefault.exec(content)) !== null) {
    imports.push({
      type: 'default',
      name: match[1],
      from: match[2],
      line: content.substring(0, match.index).split('\n').length,
      fullMatch: match[0],
    });
  }
  
  // Imports nommés
  patterns.importNamed.lastIndex = 0;
  while ((match = patterns.importNamed.exec(content)) !== null) {
    const namedImports = match[1].split(',').map(s => s.trim());
    namedImports.forEach(name => {
      const cleanName = name.split(' as ')[0].trim();
      imports.push({
        type: 'named',
        name: cleanName,
        from: match[2],
        line: content.substring(0, match.index).split('\n').length,
        fullMatch: match[0],
      });
    });
  }
  
  // Vérifier les doublons d'imports
  const importMap = new Map();
  imports.forEach(imp => {
    const key = `${imp.name}-${imp.from}`;
    if (importMap.has(key)) {
      const existing = importMap.get(key);
      if (!issues.some(i => i.type === 'import' && i.name === imp.name)) {
        issues.push({
          type: 'import',
          name: imp.name,
          from: imp.from,
          lines: [existing.line, imp.line],
          message: `Import '${imp.name}' en double depuis '${imp.from}' (lignes ${existing.line} et ${imp.line})`,
        });
      }
    } else {
      importMap.set(key, imp);
    }
  });
  
  // Extraire les déclarations
  const declarations = [];
  
  Object.keys(patterns).forEach(patternName => {
    if (patternName === 'import' || patternName === 'importDefault' || 
        patternName === 'importNamed' || patternName === 'importType') {
      return;
    }
    
    const pattern = patterns[patternName];
    pattern.lastIndex = 0;
    
    while ((match = pattern.exec(content)) !== null) {
      if (match[1]) {
        declarations.push({
          type: patternName,
          name: match[1].trim(),
          line: content.substring(0, match.index).split('\n').length,
          fullMatch: match[0],
        });
      }
    }
  });
  
  // Vérifier les doublons de déclarations
  const declarationMap = new Map();
  declarations.forEach(decl => {
    if (declarationMap.has(decl.name)) {
      const existing = declarationMap.get(decl.name);
      if (!issues.some(i => i.type === 'declaration' && i.name === decl.name)) {
        issues.push({
          type: 'declaration',
          name: decl.name,
          declarationType: decl.type,
          lines: [existing.line, decl.line],
          message: `${decl.type === 'function' ? 'Fonction' : 
                    decl.type === 'class' ? 'Classe' : 
                    decl.type === 'interface' ? 'Interface' : 
                    decl.type === 'type' ? 'Type' : 
                    decl.type === 'const' ? 'Constante' : 
                    decl.type === 'let' ? 'Variable let' : 
                    decl.type === 'var' ? 'Variable var' : 
                    'Déclaration'} '${decl.name}' déclarée en double (lignes ${existing.line} et ${decl.line})`,
        });
      }
    } else {
      declarationMap.set(decl.name, decl);
    }
  });
  
  return issues;
}

/**
 * Fonction principale
 */
async function main() {
  console.log(`${colors.cyan}🔍 Vérification des doublons d'import et de déclarations...${colors.reset}\n`);
  
  const srcDir = join(process.cwd(), 'client', 'src');
  
  try {
    const files = await getAllFiles(srcDir);
    totalFiles = files.length;
    
    console.log(`${colors.blue}📁 ${totalFiles} fichiers analysés${colors.reset}\n`);
    
    for (const filePath of files) {
      try {
        const content = await readFile(filePath, 'utf-8');
        const issues = analyzeFile(content, filePath);
        
        if (issues.length > 0) {
          filesWithDuplicates++;
          totalDuplicates += issues.length;
          
          const relativePath = filePath.replace(process.cwd(), '');
          duplicates.push({
            file: relativePath,
            issues: issues,
          });
          
          issues.forEach(issue => {
            console.log(`${colors.red}⚠️  ${issue.message}${colors.reset}`);
            console.log(`   Fichier: ${relativePath}\n`);
          });
        }
      } catch (error) {
        console.error(`${colors.red}❌ Erreur lors de la lecture de ${filePath}:${colors.reset}`, error.message);
      }
    }
    
    // Résumé
    console.log(`\n${colors.cyan}════════════════════════════════════════════════════${colors.reset}`);
    console.log(`${colors.cyan}📊 Résumé de l'analyse${colors.reset}`);
    console.log(`${colors.cyan}════════════════════════════════════════════════════${colors.reset}\n`);
    
    console.log(`Fichiers analysés: ${colors.blue}${totalFiles}${colors.reset}`);
    console.log(`Fichiers avec doublons: ${filesWithDuplicates > 0 ? colors.red : colors.green}${filesWithDuplicates}${colors.reset}`);
    console.log(`Total de doublons trouvés: ${totalDuplicates > 0 ? colors.red : colors.green}${totalDuplicates}${colors.reset}\n`);
    
    if (totalDuplicates === 0) {
      console.log(`${colors.green}✅ Aucun doublon détecté !${colors.reset}\n`);
      process.exit(0);
    } else {
      console.log(`${colors.red}❌ Doublons détectés !${colors.reset}`);
      console.log(`${colors.yellow}💡 Action recommandée:${colors.reset}`);
      console.log(`${colors.yellow}   1. Ouvrez le fichier mentionné${colors.reset}`);
      console.log(`${colors.yellow}   2. Supprimez la ligne de doublon${colors.reset}`);
      console.log(`${colors.yellow}   3. Relancez 'npm run dev'${colors.reset}\n`);
      process.exit(1);
    }
  } catch (error) {
    console.error(`${colors.red}❌ Erreur:${colors.reset}`, error.message);
    process.exit(1);
  }
}

// Lancer le script
main().catch(error => {
  console.error(`${colors.red}❌ Erreur fatale:${colors.reset}`, error);
  process.exit(1);
});
