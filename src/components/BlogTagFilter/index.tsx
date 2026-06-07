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

  // MUI Tabs doesn't fire onChange when clicking the already-selected tab,
  // so we handle deselection via onClick on the active tab.
  const handleActiveClick = () => {
    if (activeTag !== "all") router.push("/blog");
  };

  return (
    <CustomTabs
      value={activeTag}
      onChange={handleChange}
      aria-label="Filter posts by tag"
      centered={false}
      variant="scrollable"
      scrollButtons="auto"
      sx={{
        "& .MuiTabs-flexContainer": {
          flexWrap: "nowrap",
          justifyContent: "flex-start",
        },
      }}
    >
      <CustomTab value="all" label="All" />
      {tags.map((tag) => (
        <CustomTab
          key={tag}
          value={tag}
          label={tag}
          onClick={tag === activeTag ? handleActiveClick : undefined}
        />
      ))}
    </CustomTabs>
  );
};

export default BlogTagFilter;
