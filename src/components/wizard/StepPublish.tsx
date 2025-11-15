// src/components/wizard/StepPublish.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, Loader2, AlertCircle, Sparkles, Gift } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface StepPublishProps {
  data: any;
  onUpdate: (data: any) => void;
}

const StepPublish = ({ data }: StepPublishProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [wishName, setWishName] = useState(data.name?.toLowerCase().replace(/\s+/g, "-") || "");
  const [checking, setChecking] = useState(false);
  const [urlAvailable, setUrlAvailable] = useState<boolean | null>(null);
  const [suggestedUrl, setSuggestedUrl] = useState("");
  const [userRegion, setUserRegion] = useState("");
  const [isPremium, setIsPremium] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  
  // ✅ DYNAMIC DOMAIN - Uses actual current domain
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
      console.error('No user found');
      toast.error('Please log in to continue');
      setLoadingProfile(false);
      return;
    }

    try {
      setLoadingProfile(true);
      
      // Try to fetch from profiles table
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('region, is_premium')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Profile query error:', error);
        
        // ✅ FALLBACK: Use user metadata if profile doesn't exist
        const fallbackRegion = user.user_metadata?.region || 'AS';
        const fallbackPremium = false;
        
        console.log('Using fallback data:', { region: fallbackRegion, isPremium: fallbackPremium });
        
        setUserRegion(fallbackRegion);
        setIsPremium(fallbackPremium);
        
        toast.info(`Using default region: ${fallbackRegion}. You can update this in settings.`);
        setLoadingProfile(false);
        return;
      }

      if (!profile) {
        // Profile doesn't exist, create it
        console.log('Profile not found, creating one...');
        
        const fallbackRegion = user.user_metadata?.region || 'AS';
        const fallbackUsername = user.user_metadata?.username || user.email?.split('@')[0] || 'user';
        
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            username: fallbackUsername,
            region: fallbackRegion,
            is_premium: false,
            google_auth_enabled: false
          });

        if (insertError) {
          console.error('Failed to create profile:', insertError);
          // Still use fallback data
          setUserRegion(fallbackRegion);
          setIsPremium(false);
        } else {
          setUserRegion(fallbackRegion);
          setIsPremium(false);
          toast.success('Profile created successfully');
        }
      } else {
        // Profile exists
        setUserRegion(profile.region);
        setIsPremium(profile.is_premium || false);
      }
    } catch (error) {
      console.error('Unexpected error fetching user details:', error);
      
      // ✅ ULTIMATE FALLBACK
      const fallbackRegion = user.user_metadata?.region || 'AS';
      setUserRegion(fallbackRegion);
      setIsPremium(false);
      
      toast.warning('Using default settings. You can update them later.');
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
        .from('wishes')
        .select('id')
        .eq('custom_url', customUrl)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setUrlAvailable(false);
        setSuggestedUrl(`${wishName}-${Math.floor(Math.random() * 9999)}`);
      } else {
        setUrlAvailable(true);
        setSuggestedUrl("");
      }
    } catch (error) {
      console.error('Error checking URL:', error);
      toast.error('Failed to check URL availability');
    } finally {
      setChecking(false);
    }
  };

  const findVipSlot = async () => {
    const vipSlots = Array.from({ length: 10 }, (_, i) => `vip${i + 1}`);
    
    for (const slot of vipSlots) {
      const customUrl = `${userRegion}/${slot}/${wishName}`;
      
      const { data, error } = await supabase
        .from('wishes')
        .select('id')
        .eq('custom_url', customUrl)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') continue;
      
      if (!data) return customUrl;
    }
    
    return null;
  };

  const uploadImages = async (wishId: string): Promise<string[]> => {
    const uploadedUrls: string[] = [];
    
    for (let i = 0; i < data.images.length; i++) {
      const file = data.images[i];
      const fileExt = file.name.split('.').pop();
      const fileName = `${wishId}/${Date.now()}-${i}.${fileExt}`;
      
      try {
        const { error: uploadError } = await supabase.storage
          .from('wish-images')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('wish-images')
          .getPublicUrl(fileName);

        uploadedUrls.push(publicUrl);
      } catch (error) {
        console.error('Error uploading image:', error);
        toast.error(`Failed to upload image ${i + 1}`);
      }
    }
    
    return uploadedUrls;
  };

  const handlePublish = async () => {
    if (!urlAvailable && !isPremium) {
      toast.error("This URL is not available. Please change the wish name or upgrade to Premium.");
      return;
    }

    if (!data.name || !data.template || !data.date) {
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

      const birthdayTime = data.time || '00:00:00';

      // Create wish record
      const { data: wishData, error: wishError } = await supabase
        .from('wishes')
        .insert({
          user_id: user?.id,
          recipient_name: data.name,
          template_id: data.template,
          status: 'scheduled',
          birthday_date: data.date.split('T')[0],
          birthday_time: birthdayTime,
          privacy: data.privacy,
          password_hash: data.privacy === 'private' ? data.password : null,
          custom_url: finalUrl,
          music_id: data.song || 'happy',
          views_count: 0
        })
        .select()
        .single();

      if (wishError) throw wishError;

      // Upload images if any
      if (data.images && data.images.length > 0) {
        toast.info('Uploading images...');
        const imageUrls = await uploadImages(wishData.id);
        
        if (imageUrls.length > 0) {
          const imagePromises = imageUrls.map((url, index) => 
            supabase
              .from('wish_images')
              .insert({
                wish_id: wishData.id,
                image_url: url,
                order_index: index
              })
          );

          await Promise.all(imagePromises);
        }
      }

      toast.success("Birthday wish published successfully!");
      navigate("/bestwishes/home");
    } catch (error: any) {
      console.error('Error publishing wish:', error);
      toast.error(error.message || "Failed to publish wish");
    } finally {
      setPublishing(false);
    }
  };

  const generatedUrl = `${currentDomain}/${userRegion}/${wishName}`;
  
  // ✅ Check if we can enable buttons
  const canPublish = !publishing && 
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

  return (
    <div className="space-y-6">
      {/* Loading State */}
      {loadingProfile && (
        <div className="bg-card p-8 rounded-3xl shadow-lg text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      )}

      {/* Main Content - Only show when profile is loaded */}
      {!loadingProfile && (
        <>
          {/* URL Configuration */}
          <div className="bg-card p-8 md:p-12 rounded-3xl shadow-lg">
            <h2 className="text-3xl font-bold mb-3">Customize Your Wish URL</h2>
            <p className="text-muted-foreground mb-6">
              Choose a memorable URL for {data.name || "your loved one"}'s birthday wish
            </p>

            <div className="space-y-4">
              <div>
                <Label className="text-base mb-3 block">Wish Name (URL-friendly)</Label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      value={wishName}
                      onChange={(e) => {
                        const cleaned = e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9-]/g, '-')
                          .replace(/-+/g, '-');
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

              {/* URL Preview with Dynamic Domain */}
              <div className="p-4 rounded-2xl bg-muted/50 border border-border">
                <Label className="text-sm text-muted-foreground mb-2 block">Your Wish URL</Label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-lg font-mono text-foreground break-all">
                    {generatedUrl}
                  </code>
                  {urlAvailable === true && (
                    <Badge className="bg-green-500 shrink-0">Available</Badge>
                  )}
                  {urlAvailable === false && !isPremium && (
                    <Badge variant="destructive" className="shrink-0">Taken</Badge>
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
                    This URL is taken, but as a Premium member, we'll automatically assign you a VIP slot.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>

          {/* Wish Summary */}
          <div className="bg-card p-8 md:p-12 rounded-3xl shadow-lg text-center">
            <div className="inline-flex p-6 rounded-full gradient-primary mb-6 animate-pulse-soft">
              <Gift className="w-16 h-16 text-white" />
            </div>
            
            <h2 className="text-3xl font-bold mb-3">Ready to Publish! 🎉</h2>
            <p className="text-muted-foreground text-lg mb-8">
              Share this special moment with {data.name || "your loved one"}
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
                  {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </Button>
              </div>
            </div>

            <div className="bg-muted/30 rounded-2xl p-6 max-w-lg mx-auto space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Recipient:</span>
                <span className="font-semibold">{data.name || "Not set"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Template:</span>
                <span className="font-semibold">{data.template || "Not selected"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Birthday:</span>
                <span className="font-semibold">
                  {data.date ? new Date(data.date).toLocaleDateString() : "Not set"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Images:</span>
                <span className="font-semibold">{data.images?.length || 0} photos</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Privacy:</span>
                <Badge variant={data.privacy === "private" ? "secondary" : "outline"}>
                  {data.privacy === "private" ? "🔒 Private" : "🌍 Public"}
                </Badge>
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
        </>
      )}
    </div>
  );
};

export default StepPublish;
