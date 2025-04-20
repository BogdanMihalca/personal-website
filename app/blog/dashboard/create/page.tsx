/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { HologramContainer } from "@/components/custom/hologram-container";
import { GlitchText } from "@/components/custom/glitch-text";
import { CyberpunkButton } from "@/components/custom/cyber-button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSession } from "next-auth/react";
import { createPost } from "@/lib/db-actions/post-actions";
import { upsertSEOData } from "@/lib/db-actions/seo-actions";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DecoDivider } from "@/components/custom/deco-divider";
import { motion } from "framer-motion";
import { ArrowLeft, Save } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContentRenderer } from "@/lib/content-renderer";
import { PostStatus } from "@prisma/client";
import { Checkbox } from "@/components/ui/checkbox";
import CategorySelector from "@/components/custom/category-selector";
import TagSelector from "@/components/custom/tag-selector";
import SEOForm, { SEOData } from "@/components/custom/seo-form";
import EnhancedEditor from "@/components/custom/enhanced-editor";
import ImageUpload from "@/components/custom/image-upload";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  shortDesc: z.string().optional(),
  categoryId: z.number().optional(),
  status: z.nativeEnum(PostStatus),
  featured: z.boolean().default(false),
});

export default function CreatePostPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [content, setContent] = useState<string>("{}");
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [seoData, setSeoData] = useState<SEOData>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slug: "",
      shortDesc: "",
      status: PostStatus.DRAFT,
      featured: false,
    },
  });

  const generateSlugFromTitle = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, "-");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setValue("title", e.target.value);

    if (!form.getValues("slug")) {
      const generatedSlug = generateSlugFromTitle(e.target.value);
      form.setValue("slug", generatedSlug);
    }
  };

  const handleImageSelect = () => {
    const mockImageUrl = `https://picsum.photos/seed/${Math.random()}/800/600`;
    setMainImage(mockImageUrl);
  };

  const triggerFileInput = () => {
    imageInputRef.current?.click();
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);

      const authorId = session?.user?.id;

      if (!authorId) {
        throw new Error("You must be logged in to create posts");
      }

      const newPost = await createPost({
        title: values.title,
        slug: values.slug,
        content: content,
        shortDesc: values.shortDesc || undefined,
        mainImage: mainImage || undefined,
        featured: values.featured,
        status: values.status,
        authorId,
        categoryId: values.categoryId,
        tags: selectedTags.length > 0 ? selectedTags : undefined,
      });

      if (newPost) {
        // Save SEO data after post is created
        if (Object.keys(seoData).length > 0) {
          await upsertSEOData(newPost.id, seoData);
        }

        if (values.status === PostStatus.PUBLISHED) {
          router.push(`/blog/${newPost.slug}`);
        } else {
          router.push("/blog/dashboard");
        }
      }
    } catch (error) {
      console.error("Error creating post:", error);

      if ((error as Error).message === "Slug is already in use") {
        form.setError("slug", {
          type: "manual",
          message: "This URL is already in use. Please choose a different one.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 font-mono text-zinc-300 mt-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <CyberpunkButton
              variant="secondary"
              size="sm"
              icon={<ArrowLeft className="h-4 w-4" />}
              onClick={() => router.push("/blog/dashboard")}
            >
              BACK
            </CyberpunkButton>
            <h1 className="ml-4 text-xl font-bold text-neon-cyan">
              <GlitchText color="cyan" intensity="medium">
                CREATE_NEW_POST
              </GlitchText>
            </h1>
          </div>

          <CyberpunkButton
            variant="primary"
            size="sm"
            icon={<Save className="h-4 w-4" />}
            onClick={form.handleSubmit(onSubmit)}
            loading={isSubmitting}
          >
            SAVE_POST
          </CyberpunkButton>
        </div>
      </motion.div>

      <DecoDivider className="my-4" variant="neon" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <HologramContainer variant="neon" className="p-6 rounded-sm">
            <Form {...form}>
              <form className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-neon-cyan">
                        POST_TITLE
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          onChange={handleTitleChange}
                          className="bg-black/50 border-neon-cyan/30 text-zinc-200"
                        />
                      </FormControl>
                      <FormMessage className="text-neon-pink" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-neon-cyan">URL_SLUG</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-black/50 border-neon-cyan/30 text-zinc-200"
                        />
                      </FormControl>
                      <FormMessage className="text-neon-pink" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="shortDesc"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-neon-cyan">
                        SHORT_DESCRIPTION
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-black/50 border-neon-cyan/30 text-zinc-200"
                        />
                      </FormControl>
                      <FormMessage className="text-neon-pink" />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </HologramContainer>

          <Tabs defaultValue="editor" className="w-full">
            <TabsList className="bg-black/50 border border-neon-cyan/20 rounded-t-md overflow-hidden">
              <TabsTrigger
                value="editor"
                className="data-[state=active]:bg-black/70 data-[state=active]:text-neon-cyan"
              >
                EDITOR
              </TabsTrigger>
              <TabsTrigger
                value="preview"
                className="data-[state=active]:bg-black/70 data-[state=active]:text-neon-cyan"
              >
                PREVIEW
              </TabsTrigger>
            </TabsList>

            <TabsContent value="editor" className="mt-0">
              <HologramContainer variant="neon" className="p-0">
                <EnhancedEditor
                  onChange={(json) => setContent(json)}
                  content={content}
                />
              </HologramContainer>
            </TabsContent>

            <TabsContent value="preview" className="mt-0">
              <HologramContainer
                variant="neon"
                className="p-6 rounded-sm min-h-[400px]"
              >
                <div className="prose prose-invert max-w-none">
                  <ContentRenderer content={content} />
                </div>
              </HologramContainer>
            </TabsContent>
          </Tabs>

          <HologramContainer variant="glitch" className="p-6 rounded-sm">
            <div className="space-y-4">
              <h2 className="text-neon-pink font-bold">
                <GlitchText color="cyan" intensity="low">
                  SEO_SETTINGS
                </GlitchText>
              </h2>
              <SEOForm onChange={setSeoData} />
            </div>
          </HologramContainer>
        </div>

        <div className="space-y-6">
          <HologramContainer variant="holo" className="p-6 rounded-sm">
            <div className="space-y-4">
              <h2 className="text-neon-purple font-bold">
                <GlitchText color="fuchsia" intensity="low">
                  POST_SETTINGS
                </GlitchText>
              </h2>
              <Form {...form}>
                <form className="space-y-4">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-neon-purple">
                          STATUS
                        </FormLabel>
                        <select
                          className="w-full p-2 bg-black/50 border border-neon-purple/30 rounded-sm text-zinc-200"
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.value)}
                        >
                          {Object.values(PostStatus).map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                        <FormMessage className="text-neon-pink" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="featured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-3 bg-black/30 rounded-md border border-neon-purple/20">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="border-neon-pink data-[state=checked]:bg-neon-pink"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-zinc-300">
                            Featured Post
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-neon-purple">
                          CATEGORY
                        </FormLabel>
                        <CategorySelector
                          value={field.value}
                          onChange={field.onChange}
                        />
                        <FormMessage className="text-neon-pink" />
                      </FormItem>
                    )}
                  />

                  <div>
                    <label className="text-neon-purple block mb-2">TAGS</label>
                    <TagSelector
                      selectedTags={selectedTags}
                      onChange={setSelectedTags}
                    />
                  </div>
                </form>
              </Form>
            </div>
          </HologramContainer>

          <HologramContainer variant="neon" className="p-6 rounded-sm">
            <div className="space-y-4">
              <h2 className="text-neon-cyan font-bold">
                <GlitchText color="cyan" intensity="low">
                  FEATURED_IMAGE
                </GlitchText>
              </h2>

              <div
                className="flex flex-col items-center justify-center border-2 border-dashed border-neon-cyan/30 bg-black/30 rounded-md p-6 cursor-pointer hover:bg-black/50 transition-colors duration-200"
                onClick={triggerFileInput}
              >
                {mainImage ? (
                  <div className="relative w-full aspect-video overflow-hidden rounded">
                    <img
                      src={mainImage}
                      alt="Featured image"
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                      <p className="text-white">Change Image</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <ImageUpload onChange={handleImageSelect} />
                  </div>
                )}
              </div>

              <input
                type="file"
                ref={imageInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageSelect}
              />

              {mainImage && (
                <button
                  onClick={() => setMainImage(null)}
                  className="w-full text-neon-pink hover:text-neon-cyan transition-colors text-sm"
                >
                  Remove Image
                </button>
              )}
            </div>
          </HologramContainer>

          <div className="sticky top-4">
            <CyberpunkButton
              variant="primary"
              fullWidth
              icon={<Save className="h-4 w-4 mr-2" />}
              onClick={form.handleSubmit(onSubmit)}
              loading={isSubmitting}
            >
              {form.getValues("status") === PostStatus.PUBLISHED
                ? "PUBLISH_POST"
                : "SAVE_DRAFT"}
            </CyberpunkButton>
          </div>
        </div>
      </div>

      <DecoDivider className="my-6" variant="neon" />
    </div>
  );
}
