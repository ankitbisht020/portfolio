type skill = {
    name: string,
    image: string,
    category: string
}

type project = {
    name: string,
    image: string,
    techstack: string,
    category: string,
    links: {
        visit: string,
        code: string,
        video: string
    },
    desc?: string | string[]   // optional: shown in the project details modal
}

type experience = {
    company: string,
    position: string,
    startDate: string,
    endDate: string,
    desc: string[]
}

type education = {
    institute: string,
    degree: string,
    startDate: string,
    endDate: string,
}

type main = {
    name: string,
    titles: string[],
    heroImage: string,
    shortDesc: string,
    techStackImages: string[],
}

type about = {
    aboutImage: string,
    aboutImageCaption: string,
    title: string,
    about: string,
    resumeUrl: string,
    callUrl: string
}

type achievement = {
    date: string,
    title: string,
    details: string
}

type stat = {
    value: number,
    label: string,
    prefix?: string,
    suffix?: string
}

type social = {
    name: string,
    icon: string,
    link: string
}

type data = {
    main: main,
    about: about,
    skills: skill[],
    projects: project[],
    experiences: experience[],
    educations: education[]
    socials: social[],
    achievements?: achievement[],
    stats?: stat[]            // optional: numbers shown in the Impact section
}

export type { data, main, about, skill, project, experience, education, social, achievement, stat };