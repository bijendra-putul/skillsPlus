'use client';

import { useQuery } from '@tanstack/react-query';
import { blogsAPI } from '@/lib/api';
import { Blog } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Textarea } from '@/components/ui/textarea';
import { useAuthStore } from '@/lib/store';
import { toast } from 'sonner';

const commentSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty'),
});

type CommentFormValues = z.infer<typeof commentSchema>;

export default function BlogDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const { isAuthenticated } = useAuthStore();
  const [showCommentForm, setShowCommentForm] = useState(false);

  const { data: blog, isLoading } = useQuery({
    queryKey: ['blog', slug],
    queryFn: () => blogsAPI.getBySlug(slug),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
  });

  const onSubmitComment = async (data: CommentFormValues) => {
    if (!isAuthenticated) {
      toast.error('Please login to comment');
      return;
    }
    
    // In a real app, this would call the API
    toast.success('Comment submitted successfully!');
    reset();
    setShowCommentForm(false);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-4 w-64 mb-8" />
        <Skeleton className="h-96 w-full mb-6" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    );
  }

  if (!blog?.blog) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold">Blog post not found</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <article className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">{blog.blog.title}</h1>
        
        <div className="flex items-center space-x-4 mb-8">
          <Avatar>
            <AvatarImage src={blog.blog.author?.avatar} />
            <AvatarFallback>
              {blog.blog.author?.name?.charAt(0) || 'A'}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{blog.blog.author?.name}</p>
            <p className="text-sm text-muted-foreground">
              {blog.blog.readTime} min read • {new Date(blog.blog.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {blog.blog.featuredImage && (
          <div className="relative h-96 mb-8">
            <img
              src={blog.blog.featuredImage}
              alt={blog.blog.title}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        )}

        <div className="prose prose-lg max-w-none mb-8">
          <p>{blog.blog.content}</p>
        </div>

        <div className="border-t pt-8">
          <Button
            variant="outline"
            onClick={() => setShowCommentForm(!showCommentForm)}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Leave a Comment
          </Button>

          {showCommentForm && (
            <form onSubmit={handleSubmit(onSubmitComment)} className="mt-4 space-y-4">
              <Textarea
                placeholder="Write your comment..."
                rows={4}
                {...register('content')}
              />
              {errors.content && (
                <p className="text-sm text-destructive">{errors.content.message}</p>
              )}
              <Button type="submit">Submit Comment</Button>
            </form>
          )}
        </div>
      </article>
    </div>
  );
}