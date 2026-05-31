"use client";

import { CustomTab, CustomTabs } from "@/app/_globalStyles";
import { useRouter } from "next/navigation";
import { SyntheticEvent } from "react";

const BlogTagFilter = ({ tags, activeTag }: { tags: string[]; activeTag: string }) => {
  const router = useRouter();

  const handleChange = (_event: SyntheticEvent, value: string) => {
    if (value === "all") {
      router.push("/blog");
    } else {
      router.push(`/blog?tag=${encodeURIComponent(value)}`);
    }
  };

  return (
    <CustomTabs value={activeTag} onChange={handleChange} aria-label="Filter posts by tag">
      <CustomTab value="all" label="All" />
      {tags.map((tag) => (
        <CustomTab key={tag} value={tag} label={tag} />
      ))}
    </CustomTabs>
  );
};

export default BlogTagFilter;
