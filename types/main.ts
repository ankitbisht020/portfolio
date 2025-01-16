const skill = {
    name: string,
    image: string,
    category: string
};

const project = {
    name: string,
    image: string,
    techstack: string,
    category: string,
    links: {
        visit: string,
        code: string,
        video: string
    }
};

const experience = {
    company: string,
    position: string,
    startDate: string,
    endDate: string,
    desc: string[]
};

const education = {
    institute: string,
    degree: string,
    startDate: string,
    endDate: string,
};

const main = {
    name: string,
    titles: string[],
    heroImage: string,
    shortDesc: string,
    techStackImages: string[],
};

const about = {
    aboutImage: string,
    aboutImageCaption: string,
    title: string,
    about: string,
    resumeUrl: string,
    callUrl: string
};

const social = {
    name: string,
    icon: string,
    link: string
};

const data = {
    main: main,
    about: about,
    skills: skill[],
    projects: project[],
    experiences: experience[],
    educations: education[],
    socials: social[]
};

export { data, main, about, skill, project, experience, education, social };
