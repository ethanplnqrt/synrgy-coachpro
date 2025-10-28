import React from "react";

type Props = { children: React.ReactNode };
type State = { hasError: boolean; error?: any };

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, info: any) {
    console.error("UI ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center">
            <h1 className="text-2xl font-bold mb-2">Un problème est survenu</h1>
            <p className="text-sm text-muted-foreground mb-4">Veuillez recharger la page ou réessayer plus tard.</p>
            <button className="px-4 py-2 rounded-md bg-primary text-primary-foreground" onClick={() => location.reload()}>Recharger</button>
          </div>
        </div>
      );
    }
    return this.props.children as any;
  }
}


