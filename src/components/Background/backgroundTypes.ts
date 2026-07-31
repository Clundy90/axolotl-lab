export interface BackgroundOption {
  id: string;
  name: string;
  url: string | null;
}

export const AQUARIUM_BACKGROUNDS: BackgroundOption[] = [
  {
    id: "water",
    name: "Water",
    url: null,
  },
  {
    id: "andromedagalaxy",
    name: "Andromeda",
    url: "/backgroundTextures/andromedagalaxy.webp",
  },
  {
    id: "bridge",
    name: "Bridge",
    url: "/backgroundTextures/bridge.webp",
  },
  {
    id: "candy",
    name: "Candy",
    url: "/backgroundTextures/candy.webp",
  },
  {
    id: "canyon",
    name: "Canyon",
    url: "/backgroundTextures/canyon.webp",
  },
  {
    id: "city",
    name: "City",
    url: "/backgroundTextures/city.webp",
  },
  {
    id: "fallriver",
    name: "Fall River",
    url: "/backgroundTextures/fallriver.webp",
  },
  {
    id: "purplestardust",
    name: "Purple Stardust",
    url: "/backgroundTextures/purplestardust.webp",
  },
  {
    id: "space",
    name: "Space",
    url: "/backgroundTextures/space.webp",
  },
  {
    id: "sunflowers",
    name: "Sunflowers",
    url: "/backgroundTextures/sunflowers.webp",
  },
];

export function getBackgroundById(id: string) {
  return (
    AQUARIUM_BACKGROUNDS.find((background) => background.id === id) ??
    AQUARIUM_BACKGROUNDS[0]
  );
}
