import { useState } from 'react';

interface NavigationLinkProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  openInNewTab?: boolean;
}

export function NavigationLink({ children, href, onClick, openInNewTab = false }: NavigationLinkProps) {
  const [isHovered, setIsHovered] = useState(false);

  const content = (
    <div
      className="box-border content-stretch flex flex-row gap-1.5 items-center justify-start p-2 lg:p-0 relative shrink-0 cursor-pointer transition-colors duration-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className={`font-['Outfit:Medium',_sans-serif] font-medium leading-[0] relative shrink-0 text-[16px] lg:text-[15px] text-left text-nowrap transition-colors duration-200 ${
        isHovered ? 'text-[#00b3e6]' : 'text-[#d7e2e4]'
      }`}>
        <p className="block leading-[20px] lg:leading-[20px] whitespace-pre">{children}</p>
      </div>
    </div>
  );

  if (href) {
    return (
      <a 
        href={href} 
        className="overflow-visible"
        target={openInNewTab ? "_blank" : undefined}
        rel={openInNewTab ? "noopener noreferrer" : undefined}
      >
        {content}
      </a>
    );
  }

  return content;
}