"use client";

import { useResponsiveLayout } from "@/lib/theme-hooks";
import { BrandingSettings } from "@zitadel/proto/zitadel/settings/v2/branding_settings_pb";
import React, { Children, ReactNode } from "react";
import { ThemeWrapper } from "./theme-wrapper";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

type SceneProps = {
  head: ReactNode;
  body: ReactNode;
};

/** Logo de Stackless (public/images) junto al nombre, en pequeño. Va siempre sobre acero profundo. */
function Brand() {
  return (
    <div className="auth-brand auth-rise">
      <img src={`${BASE}/images/stackless-logo.png`} alt="Stackless" height={40} width={35} />
      <div className="auth-brand-text">
        <span className="auth-brand-name">STACKLESS</span>
        <span className="auth-kicker">Acceso a tu cuenta</span>
      </div>
    </div>
  );
}

// Escena del login de la cuenta Stackless (estilos en styles/auth.scss): la fachada de una tienda al
// anochecer a pantalla completa y, encima, la tarjeta de acceso sobre la calle en penumbra. Es distinta al
// /login del Mostrador (la bodega por dentro) pero del mismo sistema: acero, papel y Barlow.
function AuthScene({ head, body }: SceneProps) {
  return (
    <div className="auth-scene">
      <img className="auth-bg" src={`${BASE}/images/login-fachada.jpg`} alt="" aria-hidden />
      <div className="auth-veil" aria-hidden />

      <header className="auth-top">
        <Brand />
      </header>

      <div className="auth-main">
        <div className="auth-card auth-rise" style={{ "--d": "220ms" } as React.CSSProperties}>
          {head && <div className="auth-head">{head}</div>}
          <div className="auth-body">{body}</div>
        </div>
      </div>

      <footer className="auth-foot auth-rise" style={{ "--d": "520ms" } as React.CSSProperties}>
        <span className="auth-kicker">Una sola cuenta</span>
        <span>para el punto de venta y las demás herramientas de Stackless.</span>
      </footer>
    </div>
  );
}

/**
 * DynamicTheme arma la escena del login. Los hijos:
 * - primer hijo: título y descripción (cabecera de la tarjeta)
 * - segundo hijo: formulario y botones
 * - un solo hijo: va todo en el cuerpo, sin cabecera
 *
 * El layout de la escena (foto a la izquierda desde 1024 px) lo resuelve el CSS; `isSideBySide` se les
 * sigue pasando a los hijos que lo piden como función, igual que en el login original.
 */
export function DynamicTheme({
  branding,
  children,
}: {
  children: ReactNode | ((isSideBySide: boolean) => ReactNode);
  branding?: BrandingSettings;
}) {
  const { isSideBySide } = useResponsiveLayout();

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
      <AuthScene head={hasHead ? childArray[0] : null} body={hasHead ? childArray[1] : actualChildren} />
    </ThemeWrapper>
  );
}
