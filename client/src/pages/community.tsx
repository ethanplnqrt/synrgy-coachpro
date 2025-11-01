import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { MessageCircle, Send, Users, Heart, Loader2, AlertCircle } from "lucide-react";
import { PageWrapper } from "../components/PageWrapper";
import { useAppConfig } from "../lib/config";

interface Post {
  id: string;
  author: string;
  content: string;
  likes: number;
  comments: number;
  createdAt: Date;
  liked: boolean;
}

interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: Date;
}

export default function CommunityPage() {
  const [, setLocation] = useLocation();
  const { data: config } = useAppConfig();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPosts = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/community/posts');
      if (!response.ok) {
        throw new Error('Erreur lors du chargement');
      }

      const result = await response.json();
      setPosts(result);
    } catch (err) {
      setError('Erreur lors du chargement des posts');
    } finally {
      setIsLoading(false);
    }
  };

  const mockLoadPosts = () => {
    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      const mockPosts: Post[] = [
        {
          id: "1",
          author: "Coach Marie",
          content: "Super séance HIIT ce matin ! Qui d'autre a relevé le défi ? 💪",
          likes: 12,
          comments: 5,
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          liked: false
        },
        {
          id: "2",
          author: "Athlète Tom",
          content: "Première semaine terminée ! -2kg déjà, merci Synrgy ! 🎉",
          likes: 8,
          comments: 3,
          createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
          liked: true
        },
        {
          id: "3",
          author: "Coach Sarah",
          content: "Conseil du jour : L'hydratation est cruciale pour la récupération. Buvez-vous assez d'eau ? 💧",
          likes: 15,
          comments: 7,
          createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
          liked: false
        }
      ];

      setPosts(mockPosts);
      setIsLoading(false);
    }, 1000);
  };

  const createPost = async () => {
    if (!newPost.trim()) return;

    try {
      const response = await fetch('/api/community/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newPost })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création');
      }

      setNewPost("");
      loadPosts();
    } catch (err) {
      setError('Erreur lors de la création du post');
    }
  };

  const mockCreatePost = () => {
    if (!newPost.trim()) return;

    const newPostData: Post = {
      id: Date.now().toString(),
      author: "Vous",
      content: newPost,
      likes: 0,
      comments: 0,
      createdAt: new Date(),
      liked: false
    };

    setPosts(prev => [newPostData, ...prev]);
    setNewPost("");
  };

  const toggleLike = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            liked: !post.liked, 
            likes: post.liked ? post.likes - 1 : post.likes + 1 
          }
        : post
    ));
  };

  return (
    <PageWrapper className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            👥 Communauté Synrgy
          </h1>
          <p className="text-muted-foreground">
            Partagez vos progrès et encouragez la communauté
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Créer un post
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Partagez vos progrès ou posez une question..."
              className="min-h-[80px]"
            />
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                {newPost.length}/500 caractères
              </div>
              <div className="flex gap-2">
                {config?.testMode && (
                  <Button onClick={mockCreatePost} variant="secondary" disabled={!newPost.trim()}>
                    <Send className="w-4 h-4 mr-2" />
                    Poster (Démo)
                  </Button>
                )}
                <Button onClick={createPost} disabled={!newPost.trim()}>
                  <Send className="w-4 h-4 mr-2" />
                  Poster
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Posts récents</h2>
          <div className="flex gap-2">
            {config?.testMode && (
              <Button onClick={mockLoadPosts} variant="secondary" size="sm">
                <Users className="w-4 h-4 mr-2" />
                Charger démo
              </Button>
            )}
            <Button onClick={loadPosts} variant="outline" size="sm" disabled={isLoading}>
              <MessageCircle className="w-4 h-4 mr-2" />
              Actualiser
            </Button>
          </div>
        </div>

        {isLoading ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Chargement des posts...</p>
            </CardContent>
          </Card>
        ) : posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map((post) => (
              <Card key={post.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{post.author}</h3>
                      <p className="text-sm text-muted-foreground">
                        {post.createdAt.toLocaleString()}
                      </p>
                    </div>
                    <Badge variant="outline">Communauté</Badge>
                  </div>
                  
                  <p className="mb-4">{post.content}</p>
                  
                  <div className="flex items-center gap-4">
                    <Button
                      onClick={() => toggleLike(post.id)}
                      variant="ghost"
                      size="sm"
                      className={post.liked ? "text-red-500" : ""}
                    >
                      <Heart className={`w-4 h-4 mr-1 ${post.liked ? "fill-current" : ""}`} />
                      {post.likes}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      {post.comments}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Aucun post</h3>
              <p className="text-muted-foreground mb-4">
                Soyez le premier à partager avec la communauté !
              </p>
              {config?.testMode && (
                <Button onClick={mockLoadPosts}>
                  Charger des posts de démonstration
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {error && (
          <Card className="border-destructive">
            <CardContent className="p-6 text-center">
              <AlertCircle className="w-8 h-8 mx-auto mb-4 text-destructive" />
              <h3 className="text-lg font-semibold mb-2 text-destructive">Erreur</h3>
              <p className="text-muted-foreground">{error}</p>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-center gap-4">
          <Button onClick={() => setLocation('/coach/dashboard')} variant="outline">
            Retour au dashboard
          </Button>
        </div>
      </div>
    </PageWrapper>
  );
}




