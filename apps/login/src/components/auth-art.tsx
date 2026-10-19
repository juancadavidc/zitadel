// Tarjeta de arte del layout lateral. Es un SVG estático (public/images/auth-art.svg): las capas del
// logo como láminas de vidrio entre orbes y burbujas. El basePath hay que anteponerlo a mano en <img>.
export function AuthArt() {
  return (
    <div className="glass-art" aria-hidden>
      <img src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/images/auth-art.svg`} alt="" />
    </div>
  );
}
