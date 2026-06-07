"use client";

import PostEditorForm from "@/components/PostEditorForm";
import { use } from "react";

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

export default function EditPostPage({ params }: EditPostPageProps) {
  const { id } = use(params);
  return <PostEditorForm postId={id} />;
}
