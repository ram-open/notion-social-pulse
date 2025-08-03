import { useParams, useNavigate } from "react-router-dom";
import { PortfolioDetail } from "@/components/PortfolioDetail";
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";

const Portfolio = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  if (!id) {
    navigate("/portfolios");
    return null;
  }

  const handleBack = () => {
    navigate("/portfolios");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center px-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink 
                  href="/portfolios" 
                  className="cursor-pointer hover:text-foreground transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/portfolios");
                  }}
                >
                  Portfolios
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Portfolio Details</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
      <PortfolioDetail 
        portfolioId={id}
        onBack={handleBack}
      />
    </div>
  );
};

export default Portfolio;