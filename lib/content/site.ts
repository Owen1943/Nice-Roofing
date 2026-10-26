export const site = {
  name: "NICE Roofing & Flooring",
  legalName: "NICE ROOFING AND FLOORING",
  tagline: "The Terracotta Shop",
  phone: "077 717 3041",
  tel: "+94777173041",
  address: "Puttalam–Kurunegala Road, Maveedalupotha, Kurunegala, Sri Lanka",
  facebook: "https://www.facebook.com/p/Nice-Roofing-Flooring-100068671423331/",
  maps: "https://www.google.com/maps/search/?api=1&query=Nice+Roofing+and+Flooring+Puttalam+Road+Kurunegala",
};
export const origin =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://nice-roofing-flooring.millionair67.chatgpt.site";
export function whatsapp(
  message = "Hello NICE Roofing & Flooring. I would like to enquire about your materials.",
) {
  return `https://wa.me/94777173041?text=${encodeURIComponent(message)}`;
}
export type Category = {
  slug: string;
  title: string;
  short: string;
  application: string;
  material: string;
  image: string | null;
  intro: string;
  description: string;
  types: string[];
  questions: { q: string; a: string }[];
};
export const categories: Category[] = [
  {
    slug: "roofing-tiles",
    title: "Terracotta roofing tiles",
    short: "Roofing tiles",
    application: "Roof",
    material: "Clay",
    image: "clay-roof",
    intro: "A roof with a rhythm of its own.",
    description:
      "Explore terracotta roof profiles advertised by NICE. From the curve of a Roman tile to Euro and Calicut styles, start with the character of your home, then confirm the right profile and fittings with the showroom.",
    types: [
      "Roman",
      "Euro",
      "Calicut",
      "Euro K",
      "Slate",
      "S tile",
      "Maliga",
      "Covering & ridge tiles",
    ],
    questions: [
      {
        q: "Which roofing profiles can I ask about?",
        a: "NICE advertising includes Roman, Euro, Calicut, Euro K, Slate, S, Maliga and covering tiles. Ask the showroom to confirm the currently available profiles and finishes.",
      },
      {
        q: "How do I choose the right roof tile?",
        a: "Share your roof plan or a photograph with the team. Confirm the profile, dimensions, roof pitch suitability, fittings and quantity before ordering. A qualified installer should check the installation requirements.",
      },
    ],
  },
  {
    slug: "floor-tiles",
    title: "Terracotta floor tiles",
    short: "Floor tiles",
    application: "Floor",
    material: "Clay",
    image: "floor",
    intro: "Warmth, from the ground up.",
    description:
      "Terracotta brings a warm, earthy palette to a room. Explore the floor-tile range in person to compare colour and texture, and ask about the finish suitable for your intended space.",
    types: ["Terracotta floor tiles"],
    questions: [
      {
        q: "Can I use these tiles outdoors?",
        a: "Suitability depends on the selected product, finish and installation. Ask NICE to confirm slip resistance, sealing and maintenance requirements before choosing a tile for wet or outdoor areas.",
      },
      {
        q: "Are sizes and colours available online?",
        a: "The current range, dimensions and stock are confirmed directly with the showroom. The images here are illustrative, so compare physical samples before ordering.",
      },
    ],
  },
  {
    slug: "wall-cladding",
    title: "Wall tiles & clay cladding",
    short: "Wall & cladding",
    application: "Wall",
    material: "Clay",
    image: "clay-wall",
    intro: "Give your walls another dimension.",
    description:
      "Explore terracotta wall tiles and clay cladding for a material-led interior or exterior. Discuss the surface, exposure and finish with the showroom before choosing your wall treatment.",
    types: ["Terracotta wall tiles", "Clay cladding"],
    questions: [
      {
        q: "Is the cladding suitable for an exterior wall?",
        a: "Please confirm the selected product’s exterior suitability, fixing method and weather exposure requirements with the showroom and your installer.",
      },
    ],
  },
  {
    slug: "ventilation-blocks",
    title: "Decorative ventilation blocks",
    short: "Ventilation blocks",
    application: "Wall",
    material: "Clay",
    image: "breeze-blocks",
    intro: "Space for light. Room for air.",
    description:
      "Decorative breeze blocks create patterned screens and a sense of openness. Enquire about the available designs and discuss layout and fixing requirements with a qualified installer.",
    types: ["Decorative ventilation blocks", "Breeze blocks"],
    questions: [
      {
        q: "Can ventilation blocks be structural?",
        a: "Do not assume a decorative block is load-bearing. Ask for the exact product specification and have a qualified professional confirm its use in your project.",
      },
    ],
  },
  {
    slug: "paving-stones",
    title: "Paving, bricks & stones",
    short: "Paving & stones",
    application: "Outdoor",
    material: "Brick & stone",
    image: null,
    intro: "A considered approach to the outdoors.",
    description:
      "Paving bricks, wire-cut bricks and country stones appear in NICE’s advertised range. Ask about the materials and finishes available for the path, courtyard or landscape you have in mind.",
    types: [
      "Paving bricks",
      "Wire-cut bricks",
      "Country stones",
      "Paving stones",
    ],
    questions: [
      {
        q: "Which paving is suitable for a driveway?",
        a: "Loading, base preparation, drainage and product thickness all matter. Confirm the selected product’s suitability with NICE and your installer before ordering.",
      },
    ],
  },
  {
    slug: "other-materials",
    title: "Flooring & roofing materials",
    short: "Other materials",
    application: "Other",
    material: "Other",
    image: null,
    intro: "The details that complete the picture.",
    description:
      "Ask the showroom about vinyl flooring and roofing sheets, alongside the terracotta collection. Brand, finish, availability and installation requirements should be confirmed for each enquiry.",
    types: ["Vinyl flooring enquiries", "Roofing sheet enquiries"],
    questions: [
      {
        q: "Which roofing sheet brands are available?",
        a: "Supplied advertising mentions Anton Armor and Rhino Premier. Contact NICE to check current availability and product details. No authorised-dealer status is claimed.",
      },
    ],
  },
];
export type GalleryImage = {
  id: string;
  src: string;
  alt: string;
  title: string;
  caption: string;
  width: number;
  height: number;
  category: "Roof" | "Floor" | "Wall";
  illustrative: boolean;
};
export const gallery: GalleryImage[] = [
  {
    id: "charcoal-roof",
    src: "/images/charcoal-roof.webp",
    alt: "Illustrative close-up of charcoal-coloured roof tiles in overlapping rows",
    title: "A quieter roofline",
    caption:
      "Charcoal roof study. AI-enhanced imagery; not evidence of a completed NICE project.",
    width: 1536,
    height: 1024,
    category: "Roof",
    illustrative: true,
  },
  {
    id: "bungalow",
    src: "/images/bungalow.webp",
    alt: "Illustrative tropical bungalow with a charcoal roof and landscaped garden",
    title: "At home in the landscape",
    caption:
      "Tropical home study. AI-enhanced imagery; not a documented NICE installation.",
    width: 1448,
    height: 1086,
    category: "Roof",
    illustrative: true,
  },
  {
    id: "clay-roof",
    src: "/images/clay-roof.webp",
    alt: "Illustrative terracotta roof tiles showing repeated curved profiles",
    title: "The rhythm of clay",
    caption:
      "Terracotta roof texture study. Illustrative; confirm actual products in the showroom.",
    width: 610,
    height: 614,
    category: "Roof",
    illustrative: true,
  },
  {
    id: "courtyard",
    src: "/images/courtyard.webp",
    alt: "Illustrative sunlit terracotta courtyard with brick walls and tiled floor",
    title: "Light meets earth",
    caption:
      "Courtyard material study. Illustrative architecture, not a completed NICE project.",
    width: 985,
    height: 887,
    category: "Floor",
    illustrative: true,
  },
  {
    id: "breeze-blocks",
    src: "/images/breeze-blocks.webp",
    alt: "Illustrative terracotta breeze-block screen with square openings",
    title: "A little room to breathe",
    caption:
      "Decorative block study. AI-enhanced image; designs and dimensions require confirmation.",
    width: 440,
    height: 215,
    category: "Wall",
    illustrative: true,
  },
];
export const faqs = [
  {
    q: "What does NICE Roofing & Flooring supply?",
    a: "Our advertised range includes terracotta roofing, floor and wall tiles, ventilation blocks, paving bricks, wire-cut bricks and country stones. Ask us about vinyl flooring and roofing sheets too.",
  },
  {
    q: "Where is the showroom?",
    a: "Find us on Puttalam–Kurunegala Road, Maveedalupotha, Kurunegala. Call 077 717 3041 before travelling so we can confirm the exact location and visiting hours.",
  },
  {
    q: "How do I request a quotation?",
    a: "Call, message us on WhatsApp or use the short enquiry form. Tell us the material you are considering; we can then discuss the details needed for a quote. Prices are confirmed directly.",
  },
  {
    q: "Do you arrange delivery?",
    a: "Please contact us to confirm delivery availability, service area, charges and timing for your order. These depend on the materials and destination.",
  },
  {
    q: "Can I ask about roofing construction or landscaping?",
    a: "Yes. Roofing construction and landscaping appear in our business information. Contact us to confirm the current service scope, availability and arrangements for your project.",
  },
  {
    q: "Are the images completed NICE projects?",
    a: "The current inspiration collection uses clearly labelled AI-enhanced images supplied with our design materials. They are not a verified portfolio of completed NICE projects. Compare physical samples before ordering.",
  },
];
