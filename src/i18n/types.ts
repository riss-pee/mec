export type Language = 'EN' | 'MIZO';

export interface Translations {
  nav: {
    topBarIndividuals: string;
    topBarGroups: string;
    subLocation: string;
    about: string;
    privacy: string;
    help: string;
    brandTitle: string;
    brandSubtitle: string;
    exploreCourses: string;
    resources: string;
    resourcesDropdownTitle: string;
    theExperience: string;
    mobileApp: string;
    launcher: string;
    randomLab: string;
    browseModules: string;
  };
  audience: {
    individuals: {
      badge: string;
      title: string;
      highlight: string;
      description: string;
      primaryCta: string;
      secondaryCta: string;
      featureTag: string;
      featureTitle: string;
      featureDesc: string;
    };
    groups: {
      badge: string;
      title: string;
      highlight: string;
      description: string;
      primaryCta: string;
      secondaryCta: string;
      featureTag: string;
      featureTitle: string;
      featureDesc: string;
    };
  };
  carouselSlides: Array<{
    title: string;
    highlight: string;
    description: string;
    badge: string;
  }>;
  categories: {
    sectionTitle: string;
    sectionSubtitle: string;
    schoolCoursesTitle: string;
    schoolCoursesDesc: string;
    schoolCoursesTag: string;
    physicsLabsTitle: string;
    physicsLabsDesc: string;
    physicsLabsTag: string;
    mentalMathTitle: string;
    mentalMathDesc: string;
    mentalMathTag: string;
  };
  modulesDeck: {
    sectionTag: string;
    sectionTitle: string;
    sectionSubtitle: string;
    searchPlaceholder: string;
    filterAll: string;
    filterFractions: string;
    filterGeometry: string;
    filterArithmetic: string;
    filterPhysics: string;
    filteredBy: string;
    showAll: string;
    launchGame: string;
    keyShortcut: string;
  };
  experience: {
    sectionTitle: string;
    sectionSubtitle: string;
    row1Tag: string;
    row1Title: string;
    row1Desc: string;
    row1Points: string[];
    row1VisualTitle: string;
    row1VisualTag: string;
    row1VisualCaption: string;
    row2Tag: string;
    row2Title: string;
    row2Desc: string;
    row2Points: string[];
    row2VisualTitle: string;
    row2VisualTag: string;
    row2VisualCaption: string;
    row3Tag: string;
    row3Title: string;
    row3Desc: string;
    row3Points: string[];
    row3VisualTitle: string;
    row3VisualTag: string;
    row3VisualCaption: string;
  };
  mobileBanner: {
    tag: string;
    title: string;
    description: string;
    appStore: string;
    googlePlay: string;
    scanLaunch: string;
    phoneActive: string;
    phoneSwipe: string;
  };
  mission: {
    tag: string;
    title: string;
    description: string;
    aboutBtn: string;
    privacyBtn: string;
  };
  footer: {
    missionDesc: string;
    zeroSurveillance: string;
    zeroSurveillanceDesc: string;
    colModulesTitle: string;
    colResourcesTitle: string;
    colLegalTitle: string;
    colPrivacyControlsTitle: string;
    btnStoragePreferences: string;
    btnDataDeletion: string;
    entityName: string;
    entityAddress: string;
    copyrightNotice: string;
    aboutLink: string;
    curriculumLink: string;
    accessibilityLink: string;
    contactLink: string;
    privacyLink: string;
    termsLink: string;
    refundLink: string;
    cookieLink: string;
    dataRightsLink: string;
  };
}
