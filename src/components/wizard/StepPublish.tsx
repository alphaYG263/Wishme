// src/components/wizard/StepPublish.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, Loader2, AlertCircle, Sparkles, Gift, Eye } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { WishFormData } from "@/lib/types/wish.types";
import { Card } from "@/components/ui/card";

interface StepPublishProps {
  data: WishFormData;
  onUpdate: (data: Partial<WishFormData>) => void;
}

const StepPublish = ({ data }: StepPublishProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [wishName, setWishName] = useState(
    data.recipientName?.toLowerCase().replace(/\s+/g, "-") || ""
  );
  const [checking, setChecking] = useState(false);
  const [urlAvailable, setUrlAvailable] = useState<boolean | null>(null);
  const [suggestedUrl, setSuggestedUrl] = useState("");
  const [userRegion, setUserRegion] = useState("");
  const [isPremium, setIsPremium] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [showPreview, setShowPreview] = useState(false);

  const currentDomain = window.location.host;

  useEffect(() => {
    fetchUserDetails();
  }, [user]);

  useEffect(() => {
    if (wishName && userRegion) {
      const debounce = setTimeout(() => {
        checkUrlAvailability();
      }, 500);
      return () => clearTimeout(debounce);
    }
  }, [wishName, userRegion]);

  const fetchUserDetails = async () => {
    if (!user) {
      toast.error("Please log in to continue");
      setLoadingProfile(false);
      return;
    }

    try {
      setLoadingProfile(true);

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("region, is_premium")
        .eq("id", user.id)
        .maybeSingle();

      if (error || !profile) {
        const fallbackRegion = user.user_metadata?.region || "AS";
        setUserRegion(fallbackRegion);
        setIsPremium(false);
        toast.info(`Using default region: ${fallbackRegion}`);
      } else {
        setUserRegion(profile.region);
        setIsPremium(profile.is_premium || false);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      const fallbackRegion = user.user_metadata?.region || "AS";
      setUserRegion(fallbackRegion);
      setIsPremium(false);
    } finally {
      setLoadingProfile(false);
    }
  };

  const checkUrlAvailability = async () => {
    if (!wishName || !userRegion) return;

    setChecking(true);
    try {
      const customUrl = `${userRegion}/${wishName}`;

      const { data, error } = await supabase
        .from("wishes")
        .select("id")
        .eq("custom_url", customUrl)
        .maybeSingle();

      if (error && error.code !== "PGRST116") throw error;

      if (data) {
        setUrlAvailable(false);
        setSuggestedUrl(`${wishName}-${Math.floor(Math.random() * 9999)}`);
      } else {
        setUrlAvailable(true);
        setSuggestedUrl("");
      }
    } catch (error) {
      console.error("Error checking URL:", error);
      toast.error("Failed to check URL availability");
    } finally {
      setChecking(false);
    }
  };

  const findVipSlot = async () => {
    const vipSlots = Array.from({ length: 10 }, (_, i) => `vip${i + 1}`);

    for (const slot of vipSlots) {
      const customUrl = `${userRegion}/${slot}/${wishName}`;

      const { data, error } = await supabase
        .from("wishes")
        .select("id")
        .eq("custom_url", customUrl)
        .maybeSingle();

      if (error && error.code !== "PGRST116") continue;

      if (!data) return customUrl;
    }

    return null;
  };

  const uploadSlideImages = async (wishId: string): Promise<string[]> => {
    const uploadedUrls: string[] = [];

    for (let i = 0; i < data.slides.length; i++) {
      const slide = data.slides[i];
      if (!slide.imageFile) continue;

      const fileExt = slide.imageFile.name.split(".").pop();
      const fileName = `${wishId}/slide-${i}-${Date.now()}.${fileExt}`;

      try {
        const { error: uploadError } = await supabase.storage
          .from("wish-slide-images")
          .upload(fileName, slide.imageFile, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("wish-slide-images").getPublicUrl(fileName);

        uploadedUrls.push(publicUrl);
      } catch (error) {
        console.error(`Error uploading slide ${i}:`, error);
        toast.error(`Failed to upload slide ${i + 1}`);
      }
    }

    return uploadedUrls;
  };

  const uploadCustomMusic = async (wishId: string): Promise<string | null> => {
    if (data.musicType !== "custom" || !data.musicFile) return null;

    const fileExt = data.musicFile.name.split(".").pop();
    const fileName = `${wishId}/music-${Date.now()}.${fileExt}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from("wish-music")
        .upload(fileName, data.musicFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("wish-music").getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error("Error uploading music:", error);
      toast.error("Failed to upload custom music");
      return null;
    }
  };

  const handlePublish = async () => {
    if (!urlAvailable && !isPremium) {
      toast.error(
        "This URL is not available. Please change the wish name or upgrade to Premium."
      );
      return;
    }

    if (!data.recipientName || !data.gradient || data.slides.length === 0) {
      toast.error("Please complete all required steps before publishing.");
      return;
    }

    setPublishing(true);

    try {
      let finalUrl = `${userRegion}/${wishName}`;

      if (isPremium && !urlAvailable) {
        const vipUrl = await findVipSlot();
        if (!vipUrl) {
          toast.error("All VIP slots are taken. Please try a different name.");
          setPublishing(false);
          return;
        }
        finalUrl = vipUrl;
      }

      const birthdayTime = data.birthdayTime || "00:00:00";

      // Step 1: Create wish record
      const { data: wishData, error: wishError } = await supabase
        .from("wishes")
        .insert({
          user_id: user?.id,
          recipient_name: data.recipientName,
          template_id: "custom",
          status: "scheduled",
          birthday_date: data.birthdayDate.split("T")[0],
          birthday_time: birthdayTime,
          privacy: data.privacy,
          password_hash: data.privacy === "private" ? data.password : null,
          custom_url: finalUrl,
          gradient: data.gradient,
          note_message: data.noteMessage || null,
          note_author: data.useCustomAuthor ? data.noteAuthor : user?.user_metadata?.username,
          music_type: data.musicType,
          music_preset: data.musicType === "preset" ? data.musicPreset : null,
          music_url: null, // Will update if custom
          views_count: 0,
        })
        .select()
        .single();

      if (wishError) throw wishError;

      toast.info("Uploading slides...");

      // Step 2: Upload slide images
      const slideImageUrls = await uploadSlideImages(wishData.id);

      // Step 3: Upload custom music (if any)
      let musicUrl = null;
      if (data.musicType === "custom" && data.musicFile) {
        toast.info("Uploading custom music...");
        musicUrl = await uploadCustomMusic(wishData.id);

        // Update wish with music URL
        if (musicUrl) {
          await supabase
            .from("wishes")
            .update({ music_url: musicUrl })
            .eq("id", wishData.id);
        }
      }

      // Step 4: Insert slides
      if (slideImageUrls.length > 0) {
        const slidePromises = data.slides.map((slide, index) => {
          return supabase.from("wish_slides").insert({
            wish_id: wishData.id,
            image_url: slideImageUrls[index] || "",
            frame_shape: slide.frameShape,
            slide_name: slide.slideName,
            transition: slide.transition,
            order_index: index,
          });
        });

        await Promise.all(slidePromises);
      }

      toast.success("Birthday wish published successfully!");
      navigate("/bestwishes/home");
    } catch (error: any) {
      console.error("Error publishing wish:", error);
      toast.error(error.message || "Failed to publish wish");
    } finally {
      setPublishing(false);
    }
  };

  const generatedUrl = `${currentDomain}/${userRegion}/${wishName}`;

  const canPublish =
    !publishing &&
    !loadingProfile &&
    userRegion &&
    wishName &&
    (urlAvailable || isPremium);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    toast.success("URL copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (loadingProfile) {
    return (
      <div className="bg-card p-8 rounded-3xl shadow-lg text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
        <p className="text-muted-foreground">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* URL Configuration */}
      <div className="bg-card p-8 md:p-12 rounded-3xl shadow-lg">
        <h2 className="text-3xl font-bold mb-3">Customize Your Wish URL</h2>
        <p className="text-muted-foreground mb-6">
          Choose a memorable URL for {data.recipientName}'s birthday wish
        </p>

        <div className="space-y-4">
          <div>
            <Label className="text-base mb-3 block">
              Wish Name (URL-friendly)
            </Label>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  value={wishName}
                  onChange={(e) => {
                    const cleaned = e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9-]/g, "-")
                      .replace(/-+/g, "-");
                    setWishName(cleaned);
                  }}
                  placeholder="e.g., sarah-birthday-2025"
                  className="rounded-2xl h-14 text-base font-mono"
                />
              </div>
              {checking && (
                <Button disabled className="rounded-2xl">
                  <Loader2 className="w-5 h-5 animate-spin" />
                </Button>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Only lowercase letters, numbers, and hyphens allowed
            </p>
          </div>

          {/* URL Preview */}
          <div className="p-4 rounded-2xl bg-muted/50 border border-border">
            <Label className="text-sm text-muted-foreground mb-2 block">
              Your Wish URL
            </Label>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-lg font-mono text-foreground break-all">
                {generatedUrl}
              </code>
              {urlAvailable === true && (
                <Badge className="bg-green-500 shrink-0">Available</Badge>
              )}
              {urlAvailable === false && !isPremium && (
                <Badge variant="destructive" className="shrink-0">
                  Taken
                </Badge>
              )}
            </div>
          </div>

          {/* Availability Messages */}
          {urlAvailable === false && !isPremium && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                This URL is already taken. Try: <strong>{suggestedUrl}</strong>
              </AlertDescription>
            </Alert>
          )}

          {urlAvailable === false && isPremium && (
            <Alert className="border-primary">
              <Sparkles className="h-4 w-4 text-primary" />
              <AlertDescription>
                This URL is taken, but as a Premium member, we'll automatically
                assign you a VIP slot.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>

      {/* Preview Section */}
      <div className="bg-card p-8 rounded-3xl shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold">Preview Your Wish</h3>
          <Button
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
            className="rounded-2xl gap-2"
          >
            <Eye className="w-4 h-4" />
            {showPreview ? "Hide" : "Show"} Preview
          </Button>
        </div>

        {showPreview && (
          <Card className="p-6 rounded-2xl bg-muted/30 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Recipient</p>
                <p className="font-semibold">{data.recipientName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Birthday Date
                </p>
                <p className="font-semibold">
                  {data.birthdayDate
                    ? new Date(data.birthdayDate).toLocaleDateString()
                    : "Not set"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Gradient</p>
                <p className="font-semibold capitalize">
                  {data.gradient.replace("-", " ")}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Slides</p>
                <p className="font-semibold">{data.slides.length} slides</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Music</p>
                <p className="font-semibold">
                  {data.musicType === "custom"
                    ? "Custom Music"
                    : data.musicPreset?.replace("-", " ")}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Privacy</p>
                <Badge
                  variant={data.privacy === "private" ? "secondary" : "outline"}
                >
                  {data.privacy === "private" ? "🔒 Private" : "🌍 Public"}
                </Badge>
              </div>
            </div>

            {data.noteMessage && (
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground mb-2">
                  Note Message Preview
                </p>
                <div className="p-4 rounded-xl bg-card border border-border">
                  <p className="text-sm line-clamp-3">{data.noteMessage}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    - {data.useCustomAuthor ? data.noteAuthor : "You"}
                  </p>
                </div>
              </div>
            )}
          </Card>
        )}
      </div>

      {/* Summary Section */}
      <div className="bg-card p-8 md:p-12 rounded-3xl shadow-lg text-center">
        <div className="inline-flex p-6 rounded-full gradient-primary mb-6 animate-pulse-soft">
          <Gift className="w-16 h-16 text-white" />
        </div>

        <h2 className="text-3xl font-bold mb-3">Ready to Publish! 🎉</h2>
        <p className="text-muted-foreground text-lg mb-8">
          Share this special moment with {data.recipientName}
        </p>

        <div className="max-w-2xl mx-auto mb-6">
          <div className="flex gap-2">
            <Input
              value={generatedUrl}
              readOnly
              className="rounded-2xl h-14 text-base font-mono"
            />
            <Button
              onClick={handleCopy}
              className="rounded-2xl px-6 gradient-primary border-0"
              disabled={!canPublish || loadingProfile}
            >
              {copied ? (
                <Check className="w-5 h-5" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-center pt-4">
        <Button
          size="lg"
          onClick={handlePublish}
          disabled={!canPublish || loadingProfile}
          className="rounded-2xl gradient-primary border-0 hover:opacity-90 gap-2"
        >
          {publishing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Publishing...
            </>
          ) : loadingProfile ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <Check className="w-5 h-5" />
              Publish Wish
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default StepPublish;
