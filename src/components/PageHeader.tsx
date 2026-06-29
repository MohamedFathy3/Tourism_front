import { useLanguage } from "@/i18n/LanguageContext";

interface PageHeaderProps {
  title: string;
  breadcrumb?: string;
}

const PageHeader = ({ title, breadcrumb }: PageHeaderProps) => {
  const { t } = useLanguage();

  return (
    <section className="pt-28 pb-16 section-alt text-center">
      <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">{title}</h1>
      {breadcrumb && (
        <p className="text-sm text-muted-foreground">
          {t.footer.companyName} &gt; {breadcrumb}
        </p>
      )}
    </section>
  );
};

export default PageHeader;
