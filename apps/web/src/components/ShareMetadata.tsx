import { useEffect } from "react";

type Props = {
  title: string;
  description: string;
  image: string;
  url: string;
  canonical?: string;
  robots?: string;
  twitterCard?: "summary" | "summary_large_image";
};

export default function ShareMetadata({
  title,
  description,
  image,
  url,
  canonical = url,
  robots = "index,follow",
  twitterCard = "summary_large_image",
}: Props) {
  useEffect(() => {
    document.title = title;

    const setMeta = (
      selector: string,
      attrName: "property" | "name",
      attrValue: string,
      content: string
    ) => {
      let tag = document.head.querySelector(selector) as HTMLMetaElement | null;

      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attrName, attrValue);
        document.head.appendChild(tag);
      }

      tag.setAttribute("content", content);
    };

    let canonicalLink = document.head.querySelector(
      "link[rel='canonical']"
    ) as HTMLLinkElement | null;

    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }

    canonicalLink.setAttribute("href", canonical);

    setMeta("meta[name='description']", "name", "description", description);
    setMeta("meta[name='robots']", "name", "robots", robots);
    setMeta("meta[property='og:title']", "property", "og:title", title);
    setMeta("meta[property='og:description']", "property", "og:description", description);
    setMeta("meta[property='og:image']", "property", "og:image", image);
    setMeta("meta[property='og:url']", "property", "og:url", url);
    setMeta("meta[property='og:type']", "property", "og:type", "website");

    setMeta("meta[name='twitter:card']", "name", "twitter:card", twitterCard);
    setMeta("meta[name='twitter:title']", "name", "twitter:title", title);
    setMeta("meta[name='twitter:description']", "name", "twitter:description", description);
    setMeta("meta[name='twitter:image']", "name", "twitter:image", image);
  }, [canonical, description, image, robots, title, twitterCard, url]);

  return null;
}
