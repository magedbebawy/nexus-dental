export default function PortalRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#070c18] text-slate-100 antialiased">
      {children}
    </div>
  );
}
