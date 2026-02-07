export default function BookingLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary/30 border-t-primary mx-auto" />
        <p className="mt-4 text-muted-foreground">
          Setting up booking...
        </p>
      </div>
    </div>
  );
}
