//config.ts

enum LayoutType {
  MIX = 'mix',
  TOP = 'top',
  SIDE = 'side',
}

const CONFIG = {
  appName: 'Sàn giao dịch shoppi',
  helpLink: 'https://github.com/lambro2510/salepage-fontend.git',
  enablePWA: true,
  theme: {
    accentColor: '#818cf8',
    sidebarLayout: LayoutType.TOP,
    showBreadcrumb: true,
  },
  metaTags: {
    title: 'Salepage Cms',
    description:
      'An out-of-box UI solution for enterprise applications as a React boilerplate.',
    imageURL: 'logo.svg',
  },
};

export default CONFIG;
