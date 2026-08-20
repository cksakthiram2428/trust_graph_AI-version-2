/**
 * SEO & Page Metadata Manager
 */

export interface PageMetadata {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
}

const PAGE_METADATA_MAP: Record<string, PageMetadata> = {
  landing: {
    title: "TrustGraph AI – 3D Supply Chain Knowledge Graph & Contagion Simulator",
    description: "Protect your procurement pipeline with TrustGraph AI. 3D interactive knowledge graphs, real-time risk radar, and MSMED Act statutory audits for Indian MSMEs."
  },
  "3D_SPACE": {
    title: "3D Concentric Supply Chain Orbit – TrustGraph AI",
    description: "Explore multi-tier supplier dependencies in interactive 3D space with orbital node clustering and contagion path tracing."
  },
  "2D_TOPOLOGY": {
    title: "2D Topological Supply Map – TrustGraph AI",
    description: "Analyze force-directed logistics vectors, direct tier connections, and structural dependency bottlenecks."
  },
  "RISK_MATRIX": {
    title: "Supplier Risk Quadrant & Matrix – TrustGraph AI",
    description: "Categorize vendors across critical risk quadrants, payment lag distribution, and delivery reliability metrics."
  },
  privacy: {
    title: "Privacy Policy – TrustGraph AI",
    description: "Read how TrustGraph AI protects enterprise supply chain data, DPDP Act 2023 compliance, and Udyam public registry integrations."
  },
  terms: {
    title: "Terms of Service – TrustGraph AI",
    description: "Review enterprise terms, MSME risk analytics disclaimers, AI simulation parameters, and arbitration rules."
  },
  "thank-you": {
    title: "Submission Received – TrustGraph AI",
    description: "Your MSME supply chain inquiry or audit request has been successfully recorded."
  },
  "404": {
    title: "404 - Node Orbit Not Found – TrustGraph AI",
    description: "The requested supply chain coordinate or data node does not exist in the active graph."
  }
};

export function updatePageSEO(viewKey: string, custom?: Partial<PageMetadata>) {
  const meta = { ...(PAGE_METADATA_MAP[viewKey] || PAGE_METADATA_MAP.landing), ...custom };

  // Update document title
  document.title = meta.title;

  // Update meta description
  let descTag = document.querySelector('meta[name="description"]');
  if (!descTag) {
    descTag = document.createElement("meta");
    descTag.setAttribute("name", "description");
    document.head.appendChild(descTag);
  }
  descTag.setAttribute("content", meta.description);

  // Update OpenGraph title and description
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute("content", meta.title);

  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute("content", meta.description);

  // Update Twitter cards
  const twTitle = document.querySelector('meta[name="twitter:title"]');
  if (twTitle) twTitle.setAttribute("content", meta.title);

  const twDesc = document.querySelector('meta[name="twitter:description"]');
  if (twDesc) twDesc.setAttribute("content", meta.description);
}
