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
    url: "/backgroundTextures/andromedagalaxy.jpg",
  },
  {
    id: "bridge",
    name: "Bridge",
    url: "/backgroundTextures/bridge.jpg",
  },
  {
    id: "candy",
    name: "Candy",
    url: "/backgroundTextures/candy.jpg",
  },
  {
    id: "canyon",
    name: "Canyon",
    url: "/backgroundTextures/canyon.jpg",
  },
  {
    id: "city",
    name: "City",
    url: "/backgroundTextures/city.jpg",
  },
  {
    id: "fallriver",
    name: "Fall River",
    url: "/backgroundTextures/fallriver.jpg",
  },
  {
    id: "purplestardust",
    name: "Purple Stardust",
    url: "/backgroundTextures/purplestardust.jpg",
  },
  {
    id: "space",
    name: "Space",
    url: "/backgroundTextures/space.jpg",
  },
  {
    id: "sunflowers",
    name: "Sunflowers",
    url: "/backgroundTextures/sunflowers.jpg",
  },
];

export function getBackgroundById(id: string) {
  return (
    AQUARIUM_BACKGROUNDS.find((background) => background.id === id) ??
    AQUARIUM_BACKGROUNDS[0]
  );
}
