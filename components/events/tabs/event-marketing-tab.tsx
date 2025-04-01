"use client"

import type React from "react"

import { Progress } from "@/components/ui/progress"

import { useState, useRef, useEffect } from "react"
import {
  Edit,
  Share,
  ImageIcon,
  Calendar,
  MapPin,
  Send,
  Heart,
  MessageSquare,
  Repeat,
  Bookmark,
  ThumbsUp,
  MessageCircle,
  Plus,
} from "lucide-react"
import type { Event } from "@/lib/types"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

interface EventMarketingTabProps {
  event: Event
}

// Define the type for social media posts
type SocialMediaPost = {
  id: string
  platform: "linkedin" | "twitter" | "facebook" | "instagram"
  content: string
  image?: string
  hashtags: string[]
  isScheduled: boolean
  scheduledDate?: string
  isPublished: boolean
  publishedDate?: string
  likes?: number
  comments?: number
  shares?: number
}

export function EventMarketingTab({ event }: EventMarketingTabProps) {
  // Generate default posts for each platform
  const defaultPosts: SocialMediaPost[] = [
    {
      id: "linkedin-post",
      platform: "linkedin",
      content: `Excited to announce our upcoming event: ${event.title}! Join us for an incredible experience at ${event.location}. #ProfessionalNetworking #Events #${event.title.replace(/\s+/g, "")}`,
      hashtags: ["ProfessionalNetworking", "Events", event.title.replace(/\s+/g, "")],
      isScheduled: false,
      isPublished: false,
      likes: 42,
      comments: 7,
      shares: 15,
    },
    {
      id: "twitter-post",
      platform: "twitter",
      content: `Don't miss out! ${event.title} is happening on ${new Date(event.startDate).toLocaleDateString()}. Tickets going fast! #EventAlert #${event.title.replace(/\s+/g, "")}`,
      hashtags: ["EventAlert", event.title.replace(/\s+/g, "")],
      isScheduled: false,
      isPublished: false,
      likes: 87,
      comments: 12,
      shares: 34,
    },
    {
      id: "facebook-post",
      platform: "facebook",
      content: `We're thrilled to invite you to ${event.title}! Join us for a day of amazing experiences, networking, and fun. Mark your calendars for ${new Date(event.startDate).toLocaleDateString()} at ${event.location}.`,
      hashtags: ["EventAnnouncement", "SaveTheDate", event.title.replace(/\s+/g, "")],
      isScheduled: false,
      isPublished: false,
      likes: 156,
      comments: 23,
      shares: 45,
    },
    {
      id: "instagram-post",
      platform: "instagram",
      content: `✨ ${event.title} ✨\nComing soon to ${event.location}! Stay tuned for an unforgettable experience.`,
      image: "/placeholder.svg?height=400&width=400",
      hashtags: ["EventGram", "ComingSoon", "ExcitingTimes", event.title.replace(/\s+/g, "")],
      isScheduled: false,
      isPublished: false,
      likes: 243,
      comments: 37,
      shares: 0,
    },
  ]

  // State for posts
  const [posts, setPosts] = useState<SocialMediaPost[]>(defaultPosts)

  // State for editing
  const [editingPostId, setEditingPostId] = useState<string | null>(null)
  const [editedContent, setEditedContent] = useState<string>("")
  const [editedHashtags, setEditedHashtags] = useState<string>("")

  // State for scheduling dialog
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false)
  const [schedulingPost, setSchedulingPost] = useState<SocialMediaPost | null>(null)
  const [scheduledDate, setScheduledDate] = useState<string>("")
  const [scheduledTime, setScheduledTime] = useState<string>("")

  // Ref for textarea auto-resize
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Handle starting edit mode
  const handleEdit = (post: SocialMediaPost) => {
    setEditingPostId(post.id)
    setEditedContent(post.content)
    setEditedHashtags(post.hashtags.join(", "))
  }

  // Handle saving edited content
  const handleSave = (postId: string) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            content: editedContent,
            hashtags: editedHashtags
              .split(",")
              .map((tag) => tag.trim())
              .filter((tag) => tag !== ""),
          }
        }
        return post
      }),
    )
    setEditingPostId(null)
  }

  // Handle canceling edit
  const handleCancelEdit = () => {
    setEditingPostId(null)
  }

  // Handle opening schedule dialog
  const handleSchedule = (post: SocialMediaPost) => {
    setSchedulingPost(post)

    // Set default date to tomorrow
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    setScheduledDate(tomorrow.toISOString().split("T")[0])

    // Set default time to noon
    setScheduledTime("12:00")

    setIsScheduleDialogOpen(true)
  }

  // Handle saving schedule
  const handleSaveSchedule = () => {
    if (!schedulingPost) return

    const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}:00`)

    setPosts(
      posts.map((post) => {
        if (post.id === schedulingPost.id) {
          return {
            ...post,
            isScheduled: true,
            scheduledDate: scheduledDateTime.toISOString(),
          }
        }
        return post
      }),
    )

    setIsScheduleDialogOpen(false)
    setSchedulingPost(null)
  }

  // Handle publishing post
  const handlePublish = (postId: string) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            isPublished: true,
            publishedDate: new Date().toISOString(),
          }
        }
        return post
      }),
    )
  }

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [editedContent])

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // LinkedIn Card Component
  const LinkedInCard = ({ post }: { post: SocialMediaPost }) => {
    const isEditing = editingPostId === post.id

    return (
      <Card className="overflow-hidden border-[#0077B5]/20 hover:border-[#0077B5]/50 transition-all">
        <CardHeader className="bg-[#0077B5] text-white pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <LinkedInLogo className="h-6 w-6 text-white" />
              <div>
                <CardTitle className="text-sm font-semibold">LinkedIn</CardTitle>
                <CardDescription className="text-xs text-white/80">Professional Network</CardDescription>
              </div>
            </div>
            <div className="flex items-center">
              {post.isPublished ? (
                <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                  Published
                </Badge>
              ) : post.isScheduled ? (
                <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                  Scheduled
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                  Draft
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          {isEditing ? (
            <div className="space-y-3">
              <Textarea
                ref={textareaRef}
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="min-h-[100px] w-full resize-none"
                placeholder="Write your LinkedIn post..."
              />
              <div>
                <Label htmlFor="linkedin-hashtags" className="text-xs text-muted-foreground">
                  Hashtags (comma separated)
                </Label>
                <Input
                  id="linkedin-hashtags"
                  value={editedHashtags}
                  onChange={(e) => setEditedHashtags(e.target.value)}
                  className="mt-1"
                  placeholder="e.g., Events, Networking, Professional"
                />
              </div>
            </div>
          ) : (
            <>
              <div className="text-sm whitespace-pre-line mb-2">{post.content}</div>
              <div className="flex flex-wrap gap-1 mt-2">
                {post.hashtags.map((tag, index) => (
                  <span key={index} className="text-[#0077B5] text-sm hover:underline cursor-pointer">
                    #{tag}
                  </span>
                ))}
              </div>
            </>
          )}
        </CardContent>
        <CardFooter className="border-t bg-gray-50 flex justify-between py-2">
          {isEditing ? (
            <div className="flex gap-2 w-full">
              <Button variant="ghost" size="sm" onClick={handleCancelEdit} className="text-gray-500">
                Cancel
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => handleSave(post.id)}
                className="ml-auto bg-[#0077B5] hover:bg-[#006097]"
              >
                Save
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-4 text-gray-500">
                <div className="flex items-center gap-1 text-xs">
                  <ThumbsUp className="h-4 w-4" />
                  <span>{post.likes}</span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <MessageCircle className="h-4 w-4" />
                  <span>{post.comments}</span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <Repeat className="h-4 w-4" />
                  <span>{post.shares}</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {!post.isPublished && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-500"
                      onClick={() => handleEdit(post)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-500"
                      onClick={() => handleSchedule(post)}
                    >
                      <Calendar className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-[#0077B5]" onClick={() => handlePublish(post.id)}>
                      Publish
                    </Button>
                  </>
                )}
                {post.isPublished && (
                  <Button variant="ghost" size="sm" className="text-[#0077B5]">
                    <Share className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                )}
              </div>
            </>
          )}
        </CardFooter>
      </Card>
    )
  }

  // Twitter/X Card Component
  const TwitterCard = ({ post }: { post: SocialMediaPost }) => {
    const isEditing = editingPostId === post.id

    return (
      <Card className="overflow-hidden border-gray-200 hover:border-gray-300 transition-all">
        <CardHeader className="bg-black text-white pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <XLogo className="h-5 w-5 text-white" />
              <div>
                <CardTitle className="text-sm font-semibold">X (Twitter)</CardTitle>
                <CardDescription className="text-xs text-white/80">Real-time Updates</CardDescription>
              </div>
            </div>
            <div className="flex items-center">
              {post.isPublished ? (
                <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                  Published
                </Badge>
              ) : post.isScheduled ? (
                <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                  Scheduled
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                  Draft
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4 pb-2">
          {isEditing ? (
            <div className="space-y-3">
              <div className="relative">
                <Textarea
                  ref={textareaRef}
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="min-h-[100px] w-full resize-none pr-16"
                  placeholder="What's happening?"
                  maxLength={280}
                />
                <div className="absolute bottom-2 right-2 text-xs text-gray-500">{editedContent.length}/280</div>
              </div>
              <div>
                <Label htmlFor="twitter-hashtags" className="text-xs text-muted-foreground">
                  Hashtags (comma separated)
                </Label>
                <Input
                  id="twitter-hashtags"
                  value={editedHashtags}
                  onChange={(e) => setEditedHashtags(e.target.value)}
                  className="mt-1"
                  placeholder="e.g., Events, Announcement"
                />
              </div>
            </div>
          ) : (
            <>
              <div className="text-sm whitespace-pre-line mb-2">{post.content}</div>
              <div className="flex flex-wrap gap-1 mt-2">
                {post.hashtags.map((tag, index) => (
                  <span key={index} className="text-blue-500 text-sm hover:underline cursor-pointer">
                    #{tag}
                  </span>
                ))}
              </div>
            </>
          )}
        </CardContent>
        <CardFooter className="border-t bg-white flex justify-between py-2">
          {isEditing ? (
            <div className="flex gap-2 w-full">
              <Button variant="ghost" size="sm" onClick={handleCancelEdit} className="text-gray-500">
                Cancel
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => handleSave(post.id)}
                className="ml-auto bg-black hover:bg-gray-800"
              >
                Save
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-6 text-gray-500">
                <div className="flex items-center gap-1 text-xs hover:text-blue-500 cursor-pointer">
                  <MessageSquare className="h-4 w-4" />
                  <span>{post.comments}</span>
                </div>
                <div className="flex items-center gap-1 text-xs hover:text-green-500 cursor-pointer">
                  <Repeat className="h-4 w-4" />
                  <span>{post.shares}</span>
                </div>
                <div className="flex items-center gap-1 text-xs hover:text-red-500 cursor-pointer">
                  <Heart className="h-4 w-4" />
                  <span>{post.likes}</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {!post.isPublished && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-500"
                      onClick={() => handleEdit(post)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-500"
                      onClick={() => handleSchedule(post)}
                    >
                      <Calendar className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      className="bg-black hover:bg-gray-800"
                      onClick={() => handlePublish(post.id)}
                    >
                      Post
                    </Button>
                  </>
                )}
                {post.isPublished && (
                  <Button variant="ghost" size="sm" className="text-blue-500">
                    <Share className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                )}
              </div>
            </>
          )}
        </CardFooter>
      </Card>
    )
  }

  // Facebook Card Component
  const FacebookCard = ({ post }: { post: SocialMediaPost }) => {
    const isEditing = editingPostId === post.id

    return (
      <Card className="overflow-hidden border-[#1877F2]/20 hover:border-[#1877F2]/50 transition-all">
        <CardHeader className="bg-[#1877F2] text-white pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <FacebookLogo className="h-6 w-6 text-white" />
              <div>
                <CardTitle className="text-sm font-semibold">Facebook</CardTitle>
                <CardDescription className="text-xs text-white/80">Social Network</CardDescription>
              </div>
            </div>
            <div className="flex items-center">
              {post.isPublished ? (
                <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                  Published
                </Badge>
              ) : post.isScheduled ? (
                <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                  Scheduled
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                  Draft
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          {isEditing ? (
            <div className="space-y-3">
              <Textarea
                ref={textareaRef}
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="min-h-[100px] w-full resize-none"
                placeholder="What's on your mind?"
              />
              <div>
                <Label htmlFor="facebook-hashtags" className="text-xs text-muted-foreground">
                  Hashtags (comma separated)
                </Label>
                <Input
                  id="facebook-hashtags"
                  value={editedHashtags}
                  onChange={(e) => setEditedHashtags(e.target.value)}
                  className="mt-1"
                  placeholder="e.g., Events, SaveTheDate"
                />
              </div>
            </div>
          ) : (
            <>
              <div className="text-sm whitespace-pre-line mb-2">{post.content}</div>
              <div className="flex flex-wrap gap-1 mt-2">
                {post.hashtags.map((tag, index) => (
                  <span key={index} className="text-[#1877F2] text-sm hover:underline cursor-pointer">
                    #{tag}
                  </span>
                ))}
              </div>
              <div className="mt-3 border rounded-md p-3 bg-gray-50">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">{new Date(event.startDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{event.location}</span>
                </div>
              </div>
            </>
          )}
        </CardContent>
        <CardFooter className="border-t bg-white flex justify-between py-2">
          {isEditing ? (
            <div className="flex gap-2 w-full">
              <Button variant="ghost" size="sm" onClick={handleCancelEdit} className="text-gray-500">
                Cancel
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => handleSave(post.id)}
                className="ml-auto bg-[#1877F2] hover:bg-[#166FE5]"
              >
                Save
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-4 text-gray-500">
                <div className="flex items-center gap-1 text-xs">
                  <ThumbsUp className="h-4 w-4" />
                  <span>{post.likes}</span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <MessageCircle className="h-4 w-4" />
                  <span>{post.comments}</span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <Share className="h-4 w-4" />
                  <span>{post.shares}</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {!post.isPublished && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-500"
                      onClick={() => handleEdit(post)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-500"
                      onClick={() => handleSchedule(post)}
                    >
                      <Calendar className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      className="bg-[#1877F2] hover:bg-[#166FE5]"
                      onClick={() => handlePublish(post.id)}
                    >
                      Publish
                    </Button>
                  </>
                )}
                {post.isPublished && (
                  <Button variant="ghost" size="sm" className="text-[#1877F2]">
                    <Share className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                )}
              </div>
            </>
          )}
        </CardFooter>
      </Card>
    )
  }

  // Instagram Card Component
  const InstagramCard = ({ post }: { post: SocialMediaPost }) => {
    const isEditing = editingPostId === post.id

    return (
      <Card className="overflow-hidden border-gray-200 hover:border-gray-300 transition-all">
        <CardHeader className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <InstagramLogo className="h-6 w-6 text-white" />
              <div>
                <CardTitle className="text-sm font-semibold">Instagram</CardTitle>
                <CardDescription className="text-xs text-white/80">Visual Stories</CardDescription>
              </div>
            </div>
            <div className="flex items-center">
              {post.isPublished ? (
                <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                  Published
                </Badge>
              ) : post.isScheduled ? (
                <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                  Scheduled
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                  Draft
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <div className="bg-black flex items-center justify-center">
          <img
            src={post.image || "/placeholder.svg?height=400&width=400"}
            alt="Post image"
            className="w-full h-[240px] object-cover"
          />
        </div>
        <CardContent className="pt-4">
          {isEditing ? (
            <div className="space-y-3">
              <Textarea
                ref={textareaRef}
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="min-h-[100px] w-full resize-none"
                placeholder="Write a caption..."
              />
              <div>
                <Label htmlFor="instagram-hashtags" className="text-xs text-muted-foreground">
                  Hashtags (comma separated)
                </Label>
                <Input
                  id="instagram-hashtags"
                  value={editedHashtags}
                  onChange={(e) => setEditedHashtags(e.target.value)}
                  className="mt-1"
                  placeholder="e.g., EventGram, ComingSoon"
                />
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="instagram-image" className="text-xs text-muted-foreground">
                  Image
                </Label>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <ImageIcon className="h-3.5 w-3.5" />
                  Change Image
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center gap-4">
                  <Heart className="h-5 w-5 hover:text-red-500 cursor-pointer" />
                  <MessageSquare className="h-5 w-5 hover:text-blue-500 cursor-pointer" />
                  <Send className="h-5 w-5 hover:text-blue-500 cursor-pointer" />
                </div>
                <Bookmark className="h-5 w-5 ml-auto hover:text-yellow-500 cursor-pointer" />
              </div>
              <div className="text-sm font-medium mb-1">{post.likes} likes</div>
              <div className="text-sm">
                <span className="font-semibold">{event.title}</span>{" "}
                <span className="whitespace-pre-line">{post.content}</span>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {post.hashtags.map((tag, index) => (
                  <span key={index} className="text-blue-500 text-sm hover:underline cursor-pointer">
                    #{tag}
                  </span>
                ))}
              </div>
              <div className="text-xs text-gray-500 mt-2">{post.comments} comments</div>
            </>
          )}
        </CardContent>
        <CardFooter className="border-t bg-white flex justify-between py-2">
          {isEditing ? (
            <div className="flex gap-2 w-full">
              <Button variant="ghost" size="sm" onClick={handleCancelEdit} className="text-gray-500">
                Cancel
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => handleSave(post.id)}
                className="ml-auto bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 hover:from-purple-700 hover:via-pink-600 hover:to-orange-500"
              >
                Save
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-1">
                {!post.isPublished && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-500"
                      onClick={() => handleEdit(post)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-500"
                      onClick={() => handleSchedule(post)}
                    >
                      <Calendar className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 hover:from-purple-700 hover:via-pink-600 hover:to-orange-500"
                      onClick={() => handlePublish(post.id)}
                    >
                      Share
                    </Button>
                  </>
                )}
                {post.isPublished && (
                  <Button variant="ghost" size="sm" className="text-pink-500">
                    <Share className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                )}
              </div>
            </>
          )}
        </CardFooter>
      </Card>
    )
  }

  // Schedule Dialog Component
  const ScheduleDialog = () => (
    <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Schedule Post</DialogTitle>
          <DialogDescription>Choose when you want your post to be published.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="schedule-date" className="text-right">
              Date
            </Label>
            <Input
              id="schedule-date"
              type="date"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="col-span-3"
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="schedule-time" className="text-right">
              Time
            </Label>
            <Input
              id="schedule-time"
              type="time"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="schedule-timezone" className="text-right">
              Timezone
            </Label>
            <div className="col-span-3 text-sm text-muted-foreground">
              {Intl.DateTimeFormat().resolvedOptions().timeZone}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsScheduleDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveSchedule}>Schedule</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  return (
    <div className="space-y-6">
      {/* Schedule dialog */}
      <ScheduleDialog />

      {/* Header section */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold">Social Media Marketing</h2>
          <p className="text-muted-foreground">Create and manage social media posts for your event</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="gap-1">
            <Calendar className="h-4 w-4" />
            View Calendar
          </Button>
          <Button className="gap-1">
            <Plus className="h-4 w-4" />
            Create Post
          </Button>
        </div>
      </div>

      {/* Social media cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <LinkedInCard post={posts.find((p) => p.platform === "linkedin")!} />
        <TwitterCard post={posts.find((p) => p.platform === "twitter")!} />
        <FacebookCard post={posts.find((p) => p.platform === "facebook")!} />
        <InstagramCard post={posts.find((p) => p.platform === "instagram")!} />
      </div>

      {/* Analytics section */}
      <Card>
        <CardHeader>
          <CardTitle>Social Media Performance</CardTitle>
          <CardDescription>Track engagement across platforms</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-2 h-4 w-4 rounded-full bg-[#0077B5]" />
                    <span className="text-sm font-medium">LinkedIn</span>
                  </div>
                  <span className="text-sm">{posts.find((p) => p.platform === "linkedin")?.likes || 0} likes</span>
                </div>
                <Progress value={42} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-2 h-4 w-4 rounded-full bg-black" />
                    <span className="text-sm font-medium">X (Twitter)</span>
                  </div>
                  <span className="text-sm">{posts.find((p) => p.platform === "twitter")?.likes || 0} likes</span>
                </div>
                <Progress value={87} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-2 h-4 w-4 rounded-full bg-[#1877F2]" />
                    <span className="text-sm font-medium">Facebook</span>
                  </div>
                  <span className="text-sm">{posts.find((p) => p.platform === "facebook")?.likes || 0} likes</span>
                </div>
                <Progress value={65} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-2 h-4 w-4 rounded-full bg-gradient-to-br from-yellow-400 via-red-500 to-purple-600" />
                    <span className="text-sm font-medium">Instagram</span>
                  </div>
                  <span className="text-sm">{posts.find((p) => p.platform === "instagram")?.likes || 0} likes</span>
                </div>
                <Progress value={100} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Globe icon component
function Globe(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" x2="22" y1="12" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  )
}

// Social Media Logo Components
function LinkedInLogo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function XLogo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
  )
}

function FacebookLogo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function InstagramLogo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  )
}

