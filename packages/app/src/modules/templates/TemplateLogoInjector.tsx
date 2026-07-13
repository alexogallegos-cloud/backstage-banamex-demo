import { useEffect } from 'react';

const LOGOS: Record<string, { url: string; bg: string }> = {
  'spring boot':  { url: 'https://cdn.simpleicons.org/springboot/ffffff',    bg: '#4a7c4e' },
  'quarkus':      { url: 'https://cdn.simpleicons.org/quarkus/ffffff',       bg: '#1d78f5' },
  'aws lambda':   { url: 'https://cdn.simpleicons.org/awslambda/ffffff',     bg: '#c25b00' },
  'apigee':       { url: 'https://cdn.simpleicons.org/googlecloud/ffffff',   bg: '#1a73e8' },
  'kafka streams':{ url: 'https://cdn.simpleicons.org/apachekafka/ffffff',   bg: '#1c1c2e' },
  'kafka topic':  { url: 'https://cdn.simpleicons.org/apachekafka/ffffff',   bg: '#1c1c2e' },
  'gcp cloud run':{ url: 'https://cdn.simpleicons.org/googlecloud/ffffff',   bg: '#2563eb' },
  'angular':      { url: 'https://cdn.simpleicons.org/angular/ffffff',       bg: '#b91c1c' },
  'terraform':    { url: 'https://cdn.simpleicons.org/terraform/ffffff',     bg: '#6d28d9' },
};

const INJECTED_ATTR = 'data-bdp-logo-injected';

function inject() {
  // Only search title-level elements — never description paragraphs.
  // Descriptions (p tags) mention tech names like "Spring Boot" and cause false matches.
  const candidates = document.querySelectorAll<Element>(
    '[class*="MuiCardHeader-root"] span,' +
    '[class*="MuiCardHeader-root"] h2,' +
    '[class*="MuiCardHeader-root"] h3,' +
    '[class*="MuiCardHeader-root"] h5,' +
    '[class*="MuiCardHeader-root"] h6,' +
    '[class*="ScaffolderPage"] h2,' +
    '[class*="ScaffolderPage"] h3,' +
    '[class*="ScaffolderPage"] h5,' +
    '[class*="ScaffolderPage"] h6,' +
    '[class*="TemplateCard"] h2,' +
    '[class*="TemplateCard"] h3,' +
    '[class*="TemplateCard"] h5,' +
    '[class*="TemplateCard"] h6',
  );

  candidates.forEach(el => {
    const text = (el.textContent ?? '').toLowerCase();

    for (const [keyword, { url, bg }] of Object.entries(LOGOS)) {
      if (!text.includes(keyword)) continue;

      // Use closest to find the true MuiCard root — avoids stopping at intermediate
      // elements like MuiCardContent-root (which also has "Card" in its class name).
      const card =
        el.closest('[class*="MuiCard-root"]') ??
        el.closest('[class*="MuiPaper-root"]') ??
        null;

      if (!card || card.hasAttribute(INJECTED_ATTR)) break;
      card.setAttribute(INJECTED_ATTR, keyword);

      // Find the header band inside the card (MUI CardHeader, not CardContent).
      const headerBand: HTMLElement | null =
        (card.querySelector('[class*="MuiCardHeader-root"]') as HTMLElement | null) ??
        (card.querySelector('[class*="header"]') as HTMLElement | null) ??
        (card.children[0] as HTMLElement | null);

      if (!headerBand) break;

      // Override the gradient background with the technology brand colour.
      headerBand.style.cssText += `background: ${bg} !important; position: relative;`;

      const img = document.createElement('img');
      img.src = url;
      img.alt = keyword;
      img.setAttribute('data-bdp-logo', '1');
      img.style.cssText = [
        'position:absolute',
        'top:12px',
        'right:14px',
        'width:36px',
        'height:36px',
        'object-fit:contain',
        'filter:drop-shadow(0 1px 3px rgba(0,0,0,.45))',
        'pointer-events:none',
        'z-index:10',
      ].join(';');

      headerBand.appendChild(img);
      break;
    }
  });
}

export function TemplateLogoInjector() {
  useEffect(() => {
    const t = setTimeout(inject, 800);
    let timer: ReturnType<typeof setTimeout>;

    const observer = new MutationObserver(() => {
      clearTimeout(timer);
      timer = setTimeout(inject, 300);
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      clearTimeout(t);
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  return null;
}
