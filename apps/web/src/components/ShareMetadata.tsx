import { useEffect } from "react";

type Props = {
  title: string;
  description: string;
  image: string;
  url: string;
};

export default function ShareMetadata({
  title,
  description,
  image,
  url,
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

    setMeta("meta[property='og:title']", "property", "og:title", title);
    setMeta("meta[property='og:description']", "property", "og:description", description);
    setMeta("meta[property='og:image']", "property", "og:image", image);
    setMeta("meta[property='og:url']", "property", "og:url", url);
    setMeta("meta[property='og:type']", "property", "og:type", "website");

    setMeta("meta[name='twitter:card']", "name", "twitter:card", "summary_large_image");
    setMeta("meta[name='twitter:title']", "name", "twitter:title", title);
    setMeta("meta[name='twitter:description']", "name", "twitter:description", description);
    setMeta("meta[name='twitter:image']", "name", "twitter:image", image);
  }, [title, description, image, url]);

  return null;
}
