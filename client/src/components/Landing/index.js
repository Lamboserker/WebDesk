import { WrenchScrewdriverIcon, CloudArrowUpIcon, FingerPrintIcon, UserGroupIcon } from '@heroicons/react/24/outline';

export const navigation = [
    { name: "Documentation", href: "/auth" },
    { name: "Product", href: "/" },
    { name: "Blog", href: "/" },
    { name: "About Us", href: "/" },
  ];
  
 export const stats = [
    { name: 'Integrations available', value: '20+' },
    { name: 'Total User ', value: '500+' },
    { name: 'Projects managed on WebDesk', value: '1.000+' },
    { name: 'Hours saved weekly', value: '10.000+' },
  ]
  
 export const features = [
    {
      name: 'Automated Deployment',
      description:
        'Automate your deployment process with our advanced cloud-based solutions, reducing manual efforts and errors.',
      icon: CloudArrowUpIcon,
    },
    {
      name: 'Real-Time Collaboration',
      description:
        'Work together with your team in real-time, ensuring seamless integration and continuous delivery.',
      icon: UserGroupIcon,
    },
    {
      name: 'Customizable Workspaces',
      description:
        'Tailor your workspaces to fit your project`s needs, from coding to deployment, all in one place.',
      icon: WrenchScrewdriverIcon,
    },
    {
      name: 'Version Control Integration',
      description:
        'Seamlessly integrate with version control systems like Git for better tracking and management of deployments.',
      icon: FingerPrintIcon,
    },
  ]


  