"use client";

import { Logo } from "@/components/logo";
import { useResponsiveLayout } from "@/lib/theme-hooks";
import { BrandingSettings } from "@zitadel/proto/zitadel/settings/v2/branding_settings_pb";
import React, { Children, ReactNode } from "react";
import { AuthArt } from "./auth-art";
import { ThemeWrapper } from "./theme-wrapper";

type SceneProps = {
  branding?: BrandingSettings;
  /** Tarjeta de arte a la izquierda (solo en el layout lateral). */
  art: boolean;
  head: ReactNode;
  body: ReactNode;
};

// Escena de vidrio (estilos en styles/glass.scss): fondo en degradado, panel esmerilado y, en
// escritorio, la tarjeta de arte que se solapa con el panel.
function GlassScene({ branding, art, head, body }: SceneProps) {
  return (
    <div className="glass-scene">
      <div className="glass-grid">
        {art && <AuthArt />}
        <section className="glass-panel">
          <div className="glass-inner">
            {branding && (
              <div className="glass-logo">
                <Logo
                  lightSrc={branding.lightTheme?.logoUrl}
                  darkSrc={branding.darkTheme?.logoUrl}
                  height={34}
                  width={192}
                />
              </div>
            )}
            {head && <div className="glass-head">{head}</div>}
            <div className="glass-body">{body}</div>
          </div>
        </section>
      </div>
    </div>
  );
}

/**
 * DynamicTheme elige entre el layout lateral (con tarjeta de arte) y el de una columna según
 * NEXT_PUBLIC_THEME_LAYOUT y el ancho de pantalla. En ambos:
 * - primer hijo: título y descripción (arriba del panel)
 * - segundo hijo: formulario y botones
 * - un solo hijo: va todo en el cuerpo, sin cabecera
 */
export function DynamicTheme({
  branding,
  children,
}: {
  children: ReactNode | ((isSideBySide: boolean) => ReactNode);
  branding?: BrandingSettings;
}) {
  const { isSideBySide } = useResponsiveLayout();

  // Resolve children immediately to avoid passing functions through React
  const actualChildren: ReactNode = React.useMemo(() => {
    if (typeof children === "function") {
      return (children as (isSideBySide: boolean) => ReactNode)(isSideBySide);
    }
    return children;
  }, [children, isSideBySide]);

  const childArray = Children.toArray(actualChildren);
  const hasHead = childArray.length > 1;

  return (
    <ThemeWrapper branding={branding}>
      <GlassScene
        branding={branding}
        art={isSideBySide}
        head={hasHead ? childArray[0] : null}
        body={hasHead ? childArray[1] : actualChildren}
      />
    </ThemeWrapper>
  );
}
