import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Eye, Users, Activity, User, Info, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { toast } from "sonner";

interface AccountAnalyticsProps {
  platform: string;
}

const viewsData = {
  totalViews: 533752,
  followers: { percentage: 1.5, color: "bg-purple-500" },
  nonFollowers: { percentage: 98.5, color: "bg-gray-600" },
  accountsReached: 144143,
  contentBreakdown: [
    { type: "Posts", percentage: 88.4, color: "bg-purple-500" },
    { type: "Reels", percentage: 9.2, color: "bg-purple-400" },
    { type: "Stories", percentage: 2.0, color: "bg-purple-300" },
    { type: "Videos", percentage: 0.3, color: "bg-purple-200" },
  ]
};

const interactionsData = {
  totalInteractions: 461,
  followers: { percentage: 0.4, color: "bg-purple-500" },
  nonFollowers: { percentage: 99.6, color: "bg-gray-600" },
  accountsEngaged: 435,
  contentBreakdown: [
    { type: "Posts", percentage: 59.5, color: "bg-purple-500" },
    { type: "Reels", percentage: 40.5, color: "bg-purple-400" },
  ]
};

const profileData = {
  profileActivity: 3420,
  profileVisits: 3324,
  externalLinkTaps: 96,
};

const followersData = {
  totalFollowers: 954,
  mostActiveTimes: [
    { time: "12a", count: 218, percentage: 100 },
    { time: "3a", count: 218, percentage: 100 },
    { time: "6a", count: 240, percentage: 110 },
    { time: "9a", count: 225, percentage: 103 },
    { time: "12p", count: 88, percentage: 40 },
    { time: "3p", count: 48, percentage: 22 },
    { time: "6p", count: 152, percentage: 70 },
    { time: "9p", count: 195, percentage: 89 },
  ]
};

const topContent = [
  { views: "29.7K", interactions: 30, date: "17 Jul" },
  { views: "260", interactions: 16, date: "23 Jul" },
  { views: "81", interactions: 2, date: "8 Jul" },
];

export function AccountAnalytics({ platform }: AccountAnalyticsProps) {
  const [dateRange, setDateRange] = useState("30");
  const [customDateFrom, setCustomDateFrom] = useState<Date>();
  const [customDateTo, setCustomDateTo] = useState<Date>();
  const [showCustomDate, setShowCustomDate] = useState(false);

  const handleDateRangeChange = (value: string) => {
    setDateRange(value);
    if (value !== "custom") {
      setShowCustomDate(false);
    } else {
      setShowCustomDate(true);
    }
  };

  const exportToPDF = async () => {
    try {
      toast("Generating PDF...");
      
      const element = document.getElementById("analytics-content");
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 1, // Reduced from 2 to 1 for smaller file size
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        removeContainer: true
      });

      // Use JPEG with compression for much smaller file size
      const imgData = canvas.toDataURL("image/jpeg", 0.7); // 70% quality
      const pdf = new jsPDF("p", "mm", "a4");
      
      // Calculate dimensions
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth - 20; // 10mm margin on each side
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Add title page
      pdf.setFontSize(20);
      pdf.text(`${platform.charAt(0).toUpperCase() + platform.slice(1)} Account Analytics`, 10, 20);
      
      pdf.setFontSize(12);
      const dateText = dateRange === "custom" && customDateFrom && customDateTo 
        ? `${format(customDateFrom, "MMM dd, yyyy")} - ${format(customDateTo, "MMM dd, yyyy")}`
        : `Last ${dateRange} days`;
      pdf.text(`Period: ${dateText}`, 10, 30);
      pdf.text(`Generated on: ${format(new Date(), "MMM dd, yyyy")}`, 10, 40);

      // If content is too tall, split it across multiple pages
      const pageHeight = pdfHeight - 60; // Account for margins and header
      let yPosition = 50;
      
      if (imgHeight <= pageHeight) {
        // Single page
        pdf.addImage(imgData, "JPEG", 10, yPosition, imgWidth, imgHeight);
      } else {
        // Multiple pages
        const totalPages = Math.ceil(imgHeight / pageHeight);
        
        for (let i = 0; i < totalPages; i++) {
          if (i > 0) pdf.addPage();
          
          const sourceY = i * (canvas.height / totalPages);
          const sourceHeight = canvas.height / totalPages;
          
          // Create a temporary canvas for this section
          const tempCanvas = document.createElement('canvas');
          const tempCtx = tempCanvas.getContext('2d');
          tempCanvas.width = canvas.width;
          tempCanvas.height = sourceHeight;
          
          if (tempCtx) {
            tempCtx.drawImage(canvas, 0, sourceY, canvas.width, sourceHeight, 0, 0, canvas.width, sourceHeight);
            const sectionImgData = tempCanvas.toDataURL("image/jpeg", 0.7);
            const sectionHeight = Math.min(pageHeight, imgHeight - (i * pageHeight));
            
            pdf.addImage(sectionImgData, "JPEG", 10, i === 0 ? yPosition : 10, imgWidth, sectionHeight);
          }
        }
      }

      pdf.save(`${platform}-analytics-${dateRange}days.pdf`);
      toast("PDF exported successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast("Failed to export PDF. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-notion-bg">
      {/* Header with Date Filter */}
      <div className="border-b border-notion-border bg-white/50 backdrop-blur-sm">
        <div className="p-4 space-y-4">
          <div>
            <h1 className="text-2xl font-semibold text-notion-text capitalize">{platform} Account Analytics</h1>
            <p className="text-sm text-notion-text-secondary">Monitor your account performance and engagement</p>
          </div>
          
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Select value={dateRange} onValueChange={handleDateRangeChange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="custom">Custom range</SelectItem>
              </SelectContent>
            </Select>

            {showCustomDate && (
              <div className="flex items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-40 justify-start text-left font-normal",
                        !customDateFrom && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {customDateFrom ? format(customDateFrom, "PPP") : "From date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={customDateFrom}
                      onSelect={setCustomDateFrom}
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-40 justify-start text-left font-normal",
                        !customDateTo && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {customDateTo ? format(customDateTo, "PPP") : "To date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={customDateTo}
                      onSelect={setCustomDateTo}
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}
            </div>
            
            <Button 
              onClick={exportToPDF}
              variant="outline" 
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Analytics Content */}
      <div className="p-6">
        <div id="analytics-content" className="max-w-7xl mx-auto space-y-6">
          {/* Views Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-notion-border">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-notion-text-secondary" />
                  <CardTitle className="text-notion-text">Views</CardTitle>
                  <Info className="h-4 w-4 text-notion-text-secondary" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-3xl font-bold text-notion-text">{viewsData.totalViews.toLocaleString()}</p>
                  <p className="text-sm text-notion-text-secondary">Views</p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-notion-text">Followers</span>
                    <span className="text-sm font-medium text-notion-text">{viewsData.followers.percentage}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-notion-text">Non-followers</span>
                    <span className="text-sm font-medium text-notion-text">{viewsData.nonFollowers.percentage}%</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-notion-border">
                  <p className="text-sm text-notion-text-secondary mb-1">Accounts reached</p>
                  <p className="text-2xl font-bold text-notion-text">{viewsData.accountsReached.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-notion-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-notion-text">By content type</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2 mb-4">
                  <Button variant="default" size="sm" className="rounded-full">All</Button>
                  <Button variant="secondary" size="sm" className="rounded-full">Followers</Button>
                  <Button variant="secondary" size="sm" className="rounded-full">Non-followers</Button>
                </div>

                <div className="space-y-3">
                  {viewsData.contentBreakdown.map((item, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-notion-text">{item.type}</span>
                        <span className="text-sm font-medium text-notion-text">{item.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`${item.color} h-2 rounded-full`} 
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-2 text-xs text-notion-text-secondary">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    Followers
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                    Non-followers
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Interactions Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-notion-border">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-notion-text-secondary" />
                  <CardTitle className="text-notion-text">Interactions</CardTitle>
                  <Info className="h-4 w-4 text-notion-text-secondary" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-3xl font-bold text-notion-text">{interactionsData.totalInteractions}</p>
                  <p className="text-sm text-notion-text-secondary">Interactions</p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-notion-text">Followers</span>
                    <span className="text-sm font-medium text-notion-text">{interactionsData.followers.percentage}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-notion-text">Non-followers</span>
                    <span className="text-sm font-medium text-notion-text">{interactionsData.nonFollowers.percentage}%</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-notion-border">
                  <p className="text-sm text-notion-text-secondary mb-1">Accounts engaged</p>
                  <p className="text-2xl font-bold text-notion-text">{interactionsData.accountsEngaged}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-notion-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-notion-text">By content interactions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {interactionsData.contentBreakdown.map((item, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-notion-text">{item.type}</span>
                        <span className="text-sm font-medium text-notion-text">{item.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`${item.color} h-2 rounded-full`} 
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-2 text-xs text-notion-text-secondary">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    Followers and non-followers
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile & Followers Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-notion-border">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-notion-text-secondary" />
                  <CardTitle className="text-notion-text">Profile</CardTitle>
                  <Info className="h-4 w-4 text-notion-text-secondary" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-3xl font-bold text-notion-text">{profileData.profileActivity.toLocaleString()}</p>
                  <p className="text-sm text-notion-text-secondary">Profile activity</p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-notion-text">Profile visits</span>
                    <span className="text-lg font-medium text-notion-text">{profileData.profileVisits.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-notion-text">External link taps</span>
                    <span className="text-lg font-medium text-notion-text">{profileData.externalLinkTaps}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-notion-border">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-notion-text-secondary" />
                  <CardTitle className="text-notion-text">Followers</CardTitle>
                  <Info className="h-4 w-4 text-notion-text-secondary" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-3xl font-bold text-notion-text">{followersData.totalFollowers}</p>
                  <p className="text-sm text-notion-text-secondary">Total followers</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-notion-text mb-3">Most active times</p>
                  
                  <div className="flex gap-1 mb-4">
                    {['M', 'Tu', 'W', 'Th', 'F', 'Sa', 'Su'].map((day, index) => (
                      <Button 
                        key={day} 
                        variant={index === 0 ? "default" : "secondary"} 
                        size="sm" 
                        className="w-10 h-8 text-xs rounded"
                      >
                        {day}
                      </Button>
                    ))}
                  </div>

                  <div className="space-y-2">
                    {followersData.mostActiveTimes.map((time, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-notion-text w-8">{time.time}</span>
                        <div className="flex-1 mx-3">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-purple-500 h-2 rounded-full" 
                              style={{ width: `${time.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                        <span className="text-sm font-medium text-notion-text w-8 text-right">{time.count}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 pt-2 text-xs text-notion-text-secondary">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      Followers
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Content Section */}
          <Card className="border-notion-border">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-notion-text">Top content based on views</CardTitle>
                <Button variant="ghost" size="sm" className="text-notion-accent">See all</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {topContent.map((content, index) => (
                  <Card key={index} className="border-notion-border/50">
                    <CardContent className="p-4 text-center">
                      <div className="h-32 bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                        <span className="text-gray-400">Content Preview</span>
                      </div>
                      <div className="space-y-2">
                        <p className="text-lg font-semibold text-notion-text">{content.views}</p>
                        <p className="text-sm text-notion-text-secondary">{content.date}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <Card className="border-notion-border mt-6">
                <CardHeader>
                  <CardTitle className="text-notion-text">Top content based on interactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {topContent.map((content, index) => (
                      <Card key={index} className="border-notion-border/50">
                        <CardContent className="p-4 text-center">
                          <div className="h-32 bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                            <span className="text-gray-400">Content Preview</span>
                          </div>
                          <div className="space-y-2">
                            <p className="text-lg font-semibold text-notion-text">{content.interactions}</p>
                            <p className="text-sm text-notion-text-secondary">{content.date}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}