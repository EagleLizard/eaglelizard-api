
import { JCD_PROJECT_ENUM } from './jcd-constants';

interface MediaAndPressDetail {
  description?: string;
  link?: {
    label: string;
    uri: string;
  };
  publication: string;
}

interface ProjectDetails {
  org: string;
  month: number;
  year: number;

  credit: string;
  credits: string[];
  mediaAndPress: MediaAndPressDetail[];
  originalCredits: string[];
}

interface ProjectPage {
  route: string;
  // galleryHeaderImageUri: string;
  // galleryDetailImageUri: string;
  galleryImageUris: string[];

  projectDetails: ProjectDetails;
}

export interface JcdProject {
  title: string;
  projectKey: JCD_PROJECT_ENUM;
  coverImageUri: string;
  projectPage: ProjectPage;
}

export const JCD_PROJECT_ORDER: JCD_PROJECT_ENUM[] = [
  JCD_PROJECT_ENUM.JAMES_AND_THE_GIANT_PEACH,
  JCD_PROJECT_ENUM.CINDERELLA,
  JCD_PROJECT_ENUM.SWEENEY,
  JCD_PROJECT_ENUM.URINETOWN,
  JCD_PROJECT_ENUM.TAMINGOFTHESHREW,
  JCD_PROJECT_ENUM.MRBURNS,
  JCD_PROJECT_ENUM.LARAMIE,
  JCD_PROJECT_ENUM.THE_DRAG,
  JCD_PROJECT_ENUM.NEXT_FALL,
  JCD_PROJECT_ENUM.AGAMEMNON,
  JCD_PROJECT_ENUM.TRIBES,
  JCD_PROJECT_ENUM.FAT_PIG,
  JCD_PROJECT_ENUM.UVU,
  JCD_PROJECT_ENUM.SUNDANCE,
  JCD_PROJECT_ENUM.CABARET,
];

export const JcdProjects: JcdProject[] = [
  {
    title: 'James and the Giant Peach',
    projectKey: JCD_PROJECT_ENUM.JAMES_AND_THE_GIANT_PEACH,
    coverImageUri: 'jamesandthegiantpeach.jpg',
    projectPage: {
      route: 'james-and-the-giant-peach',
      galleryImageUris: [
        'jamesandthegiantpeach/jamesandthegiantpeach1.jpg',
        'jamesandthegiantpeach/jamesandthegiantpeach2.jpg',
        'jamesandthegiantpeach/jamesandthegiantpeach3.jpg',
        'jamesandthegiantpeach/jamesandthegiantpeach4.jpg',
        'jamesandthegiantpeach/jamesandthegiantpeach5.jpg',
        'jamesandthegiantpeach/jamesandthegiantpeach6.jpg',
        'jamesandthegiantpeach/jamesandthegiantpeach7.jpg',
        'jamesandthegiantpeach/jamesandthegiantpeach8.jpg',
        'jamesandthegiantpeach/jamesandthegiantpeach9.jpg',
        'jamesandthegiantpeach/jamesandthegiantpeach10.jpg',
        'jamesandthegiantpeach/jamesandthegiantpeach11.jpg',
        'jamesandthegiantpeach/jamesandthegiantpeach12.jpg',
        'jamesandthegiantpeach/jamesandthegiantpeach13.jpg',
        'jamesandthegiantpeach/jamesandthegiantpeach14.jpg',
      ],
      projectDetails: {
        org: 'Utah Valley University',
        month: 11,
        year: 2021,
        credit: 'scenic & properties design',
        credits: [
          'Directed by Dr. Lisa Hall',
          'Choreography by Chantelle Wells',
          'Technical Direction by Cristian Bell & Glenn Pepe',
          'Lighting Design by Colin Skip Wilson',
          'Costume Design by Dayna Kay Gomar',
          'Hair & Makeup Design by Kate Backman',
          'Production Photography by Suzy Oliveira',
        ],
        mediaAndPress: [
          {
            description: '“The set and costume design created a mesmerizing and immersive atmosphere. It had a cutout of the titular peach artfully inlaid with flowers which acted as the center of the production, but there were further elements with clouds above and the city skyline in the background which gave it a sense of depth and variety.”',
            link: {
              label: '"James and the Giant Peach” - A Fun, Whimsical Story About Finding One’s Home',
              uri: 'https://www.uvureview.com/valley-life/artsculture/james-and-the-giant-peach-a-fun-whimsical-story-about-finding-ones-home/',
            },
            publication: '(UVU Review)',
          },
        ],
        originalCredits: [
          'Book by Timothy Allen McDonald',
          'Music & Lyrics by Benj Pasek & Justin Paul',
        ],
      }
    },
  },
  {
    title: 'Cinderella Eats Rice and Beans',
    projectKey: JCD_PROJECT_ENUM.CINDERELLA,
    coverImageUri: 'cinderella.jpg',
    projectPage: {
      route: 'cinderella',
      galleryImageUris: [
        'cinderella/cinderella1.jpg',
        'cinderella/cinderella2.jpg',
        'cinderella/cinderella3.jpg',
        'cinderella/cinderella4.jpg',
        'cinderella/cinderella5.jpg',
        'cinderella/cinderella6.jpg',
        'cinderella/cinderella7.jpg',
      ],
      projectDetails: {
        org: 'Utah Valley University',
        month: 2,
        year: 2021,
        credit: 'scenic & properties design',
        credits: [
          'Directed by Megan Ann Rasmussen',
          'Technical Direction by Glenn Pepe',
          'Costume Design by Michelle Walling',
          'Hair & Makeup Design by Kiyomi Coronado',
          'Production Photography by Suzy Oliveira',
        ],
        mediaAndPress: [],
        originalCredits: [
          'Book and Lyrics by Karen Zacarías',
          'Music by Deborah Wicks La Puma',
        ],
      }
    },
  },
  {
    title: 'Sweeney Todd: The Demon Barber of Fleet Street',
    projectKey: JCD_PROJECT_ENUM.SWEENEY,
    coverImageUri: 'sweeneytodd.jpg',
    projectPage: {
      route: 'sweeney-todd',
      galleryImageUris: [
        'sweeneytodd/sweeneytodd14.jpg',
        'sweeneytodd/sweeneytodd9.jpg',
        'sweeneytodd/sweeneytodd12.jpg',
        'sweeneytodd/sweeneytodd3.jpg',
        'sweeneytodd/sweeneytodd10.jpg',
        'sweeneytodd/sweeneytodd15.jpg',
        'sweeneytodd/sweeneytodd4.jpg',
        'sweeneytodd/sweeneytodd11.jpg',
        'sweeneytodd/sweeneytodd6.jpg',
        'sweeneytodd/sweeneytodd7.jpg',
        'sweeneytodd/sweeneytodd8.jpg',
        'sweeneytodd/sweeneytodd1.jpg',
        'sweeneytodd/sweeneytodd5.jpg',
        'sweeneytodd/sweeneytodd2.jpg',
        'sweeneytodd/sweeneytodd13.jpg',
        'sweeneytodd/sweeneytodd16.jpg',
        'sweeneytodd/sweeneytodd17.jpg',
        'sweeneytodd/sweeneytodd18.jpg',
      ],
      projectDetails: {
        org: 'The Noorda Center for the Performing Arts & Utah Repertory Theater Company',
        month: 10,
        year: 2019,
        credit: 'associate set design',
        credits: [
          'Directed by Tim Threlfall',
          'Technical Direction & Build by Nat Reed',
          'Set Design by Josh Steadman',
          'Properties Design by Rachel Summerhalder',
          'Lighting Design by Jaron Kent Hermansen',
          'Costume Design by Nancy Cannon',
          'Hair & Makeup Design by Samantha Lambson',
          'Production Photography by Jay Drowns',
          'BTS Photography by Janice Chan',
        ],
        mediaAndPress: [
          {
            link: {
              label: 'Sweeney Todd: The Demon Barber of Fleet Street at Utah Valley University is Bloody Superb',
              uri: 'https://frontrowreviewersutah.com/?p=13952',
            },
            publication: '(Front Row Reviewers)'
          },
          {
            link: {
              label: 'Utah Repertory Theater’s SWEENEY TODD Is A Reminder Of What Happens When A Person’s Heart Is Guided Completely By Revenge',
              uri: 'https://www.broadwayworld.com/salt-lake-city/article/BWW-Review-Utah-Repertory-Theaters-SWEENEY-TODD-Is-A-Reminder-Of-What-Happens-When-A-Persons-Heart-Is-Guided-Completely-By-Revenge-20191029',
            },
            publication: '(BroadwayWorld Review)'
          },
          {
            link: {
              label: 'SWEENEY TODD, a Utah Rep and Noorda Center Co-Production, Wildly Heralded',
              uri: 'https://www.broadwayworld.com/salt-lake-city/article/BWW-Feature-SWEENEY-TODD-a-Utah-Rep-and-Noorda-Center-Co-Production-Wildly-Heralded-20191115',
            },
            publication: '(BroadwayWorld Feature)'
          },
          {
            link: {
              label: 'Utah Repertory Theater’s Sweeney Todd is a Bloody Good Time',
              uri: 'https://www.uvureview.com/valley-life/artsculture/utah-repertory-theaters-sweeney-todd-is-a-bloody-good-time/',
            },
            publication: '(UVU Review)'
          },
        ],
        originalCredits: [
          'Book by Hugh Wheeler',
          'Music & Lyrics by Stephen Sondheim',
        ],
      },
    },
  },
  {
    title: 'Urinetown: The Musical',
    projectKey: JCD_PROJECT_ENUM.URINETOWN,
    coverImageUri: 'urinetown.jpg',
    projectPage: {
      route: 'urinetown-the-musical',
      galleryImageUris: [
        'urinetown/urinetown1.jpg',
        'urinetown/urinetown2.jpg',
        'urinetown/urinetown3.jpg',
        'urinetown/urinetown4.jpg',
        'urinetown/urinetown5.jpg',
        'urinetown/urinetown6.jpg',
        'urinetown/urinetown7.jpg',
        'urinetown/urinetown8.jpg',
        'urinetown/urinetown9.jpg',
        'urinetown/urinetown10.jpg',
        'urinetown/urinetown11.jpg',
        'urinetown/urinetown12.jpg',
        'urinetown/urinetown13.jpg',
        'urinetown/urinetown14.jpg',
        'urinetown/urinetown15.jpg',
      ],
      projectDetails: {
        org: 'Utah Valley University',
        month: 9,
        year: 2019,
        credit: 'scenic & props designer',
        credits: [
          'Directed by Matthew Herrick',
          'Technical Direction by Glenn Pepe',
          'Assistant Scenic & Properties Design by Gavin Henry',
          'Lighting Design by Colin Skip Wilson',
          'Costume Design by Mallory Goodman',
          'Hair & Makeup Design Kate Backman',
          'Production Photography by Jeremy Hall',
        ],
        mediaAndPress: [
          {
            description: '“The set, by Janice Chan, is hewn in rough scaffolding in browns and oranges and is cleverly constructed to break apart and accommodate the different scenes from the corporate suite to the sewer.”',
            link: {
              label: 'Urinetown at UVU is Streaming with Great Talent and Dark Humor',
              uri: 'https://frontrowreviewersutah.com/?p=13681',
            },
            publication: '(Front Row Reviewers)'
          },
        ],
        originalCredits: [
          'Book by Greg Kotis',
          'Music & Lyrics by Mark Hollmann & Greg Kotis',
        ],
      },
    },
  },
  {
    title: 'Taming of the Shrew',
    projectKey: JCD_PROJECT_ENUM.TAMINGOFTHESHREW,
    coverImageUri: 'tamingoftheshrew.jpg',
    projectPage: {
      route: 'taming-of-the-shrew',
      galleryImageUris: [
        'tamingoftheshrew/tamingoftheshrew1.jpg',
        'tamingoftheshrew/tamingoftheshrew2.jpg',
        'tamingoftheshrew/tamingoftheshrew3.jpg',
        'tamingoftheshrew/tamingoftheshrew4.jpg',
        'tamingoftheshrew/tamingoftheshrew5.jpg',
        'tamingoftheshrew/tamingoftheshrew6.jpg',
        'tamingoftheshrew/tamingoftheshrew7.jpg',
        'tamingoftheshrew/tamingoftheshrew8.jpg',
        'tamingoftheshrew/tamingoftheshrew9.jpg',
        'tamingoftheshrew/tamingoftheshrew10.jpg',
      ],
      projectDetails: {
        org: 'Utah Valley University',
        month: 5,
        year: 2019,
        credit: 'scenic & properties design',
        credits: [
          'Directed by Shelby Gist',
          'Lighting Design by Emma Belnap',
          'Costume Design by Danae Devey',
          'Hair & Makeup Design by Alanna Cottam',
          'Production Photography by Shelby Gist & Janice Chan',
        ],
        mediaAndPress: [
          {
            link: {
              label: 'UVU \'Taming of the Shrew\' Shines Light on Domestic Violence',
              uri: 'https://www.heraldextra.com/entertainment/2019/may/23/uvu-taming-of-the-shrew-shines-light-on-domestic-violence/',
            },
            publication: '(Daily Herald)',
          },
        ],
        originalCredits: [
          'Written by William Shakespeare',
          'Adapted by Chelsea Hickman',
        ],
      },
    },
  },
  {
    title: 'Mr. Burns: A Post-Electric Play',
    projectKey: JCD_PROJECT_ENUM.MRBURNS,
    coverImageUri: 'mrburns.jpg',
    projectPage: {
      route: 'mr-burns',
      galleryImageUris: [
        'mrburns/mrburns1.jpg',
        'mrburns/mrburns2.jpg',
        'mrburns/mrburns3.jpg',
        'mrburns/mrburns4.jpg',
        'mrburns/mrburns5.jpg',
        'mrburns/mrburns6.jpg',
        'mrburns/mrburns7.jpg',
        'mrburns/mrburns8.jpg',
        'mrburns/mrburns9.jpg',
        'mrburns/mrburns10.jpg',
        'mrburns/mrburns11.jpg',
        'mrburns/mrburns12.jpg',
        'mrburns/mrburns13.jpg',
        'mrburns/mrburns14.jpg',
        'mrburns/mrburns15.jpg',
        'mrburns/mrburns16.jpg',
        'mrburns/mrburns17.jpg',
        'mrburns/mrburns18.jpg',
      ],
      projectDetails: {
        org: 'An Other Theater Company',
        month: 7,
        year: 2019,
        credit: 'scenic & properties design',
        credits: [
          'Directed by Kacey Spadafora & Taylor Jack Nelson',
          'Scenic Painting by Janice Chan',
          'Lighting Design by Emma Belnap',
          'Costume Design by: Janae Lefleur',
          'Production Photography by Laura Chapman & Janice Chan',
        ],
        mediaAndPress: [
          {
            description: '“Janice Chan\'s set and prop design feel perfectly tuned to the bare-bones theatrical group with a splash of the cartoon humor that the story draws its inspiration from.”',
            link: {
              label: 'An Other Theater Company\'s Mr. Burns, A Post Electric Play in Provo is Funny, Sobering, Thought-Provoking, and Utterly Multifariously Unique”',
              uri: 'https://frontrowreviewersutah.com/?p=12791',
            },
            publication: '(Front Row Reviewers)',
          },
        ],
        originalCredits: [
          'Written by Anne Washburn',
        ],
      },
    },
  },
  {
    title: 'The Laramie Project',
    projectKey: JCD_PROJECT_ENUM.LARAMIE,
    coverImageUri: 'laramie_min.jpg',
    projectPage: {
      route: 'the-laramie-project',
      galleryImageUris: [
        'laramie/laramie1.jpg',
        'laramie/laramie2.jpg',
        'laramie/laramie3.jpg',
        'laramie/laramie4.jpg',
        'laramie/laramie5.jpg',
        'laramie/laramie6.jpg',
        'laramie/laramie7.jpg',
        'laramie/laramie8.jpg',
        'laramie/laramie9.jpg',
        'laramie/laramie10.jpg',
        'laramie/laramie11.jpg',
        'laramie/laramie12.jpg',
        'laramie/laramie13.jpg',
        'laramie/laramie14.jpg',
        'laramie/laramie15.jpg',
        'laramie/laramie16.jpg',
        'laramie/laramie17.jpg',
        'laramie/laramie18.jpg',
        'laramie/laramie19.jpg',
      ],
      projectDetails: {
        org: 'Utah Valley University',
        month: 1,
        year: 2019,
        credit: 'scenic & properties design',
        credits: [
          'Directed by Laurie Harrop-Purser',
          'Technical Direction by Cristian Bell',
          'Lighting Design by Colin Skip Wilson',
          'Projections Design by Emma Belnap',
          'Costume Design by Rae Sip & Kate Backman',
          'Hair & Makeup Design by Alanna Cottam',
          'Production Photos by Suzy Oliveira',
        ],
        mediaAndPress: [
          {
            description: '“Set designer Janice Chan orchestrated this in a way that seemingly transported the audience to another place.”',
            link: {
              label: '\'Laramie Project\' Asks Audiences to Examine Relationship to LGBT Community',
              uri: 'https://www.uvureview.com/news/front-page/recent/review-laramie-project-asks-audiences-to-examine-relationship-to-lgbtq-community/',
            },
            publication: '(UVU Review)',
          },
          {
            link: {
              label: 'UVU Play About Matthew Shepard Highlights Utah\'s Lack of Hate Crime Protections for LGBTQ',
              uri: 'https://www.abc4.com/news/local-news/uvu-play-about-matthew-shepard-highlights-utahs-lack-of-hate-crime-protections-for-lgbtq/',
            },
            publication: '(ABC4 News)',
          },
        ],
        originalCredits: [
          'Written by Moisés Kaufman',
          '& the members of the Tectonic Theater Project',
        ],
      },
    },
  },
  {
    title: 'The Drag',
    projectKey: JCD_PROJECT_ENUM.THE_DRAG,
    coverImageUri: 'thedrag.jpg',
    projectPage: {
      route: 'the-drag',
      galleryImageUris: [
        'thedrag/thedrag1.jpg',
        'thedrag/thedrag2.jpg',
        'thedrag/thedrag3.jpg',
        'thedrag/thedrag4.jpg',
        'thedrag/thedrag5.jpg',
        'thedrag/thedrag6.jpg',
        'thedrag/thedrag7.jpg',
        'thedrag/thedrag8.jpg',
        'thedrag/thedrag9.jpg',
        'thedrag/thedrag10.jpg',
      ],
      projectDetails: {
        org: 'An Other Theater Company',
        month: 7,
        year: 2018,
        credit: 'scenic & properties design',
        credits: [
          'Directed by Taylor Jack Nelson',
          'Scenic Painting by Janice Chan & Tyler Whited',
          'Lighting Design by Aimee Findley Moore',
          'Costume Design by Ash Knowles',
          'Hair & Makeup Design by Christopher-Alan Pederson',
          'Production Photography by Laura Chapman',
        ],
        mediaAndPress: [
          {
            description: '“Janice Chan\'s set and props create the perfect atmosphere for a jazz-age romp.”',
            link: {
              label: 'Is that The Drag at An Other Theater Company in Provo, or Are You Just Happy to See Me?',
              uri: 'https://frontrowreviewersutah.com/?p=8462',
            },
            publication: '(Front Row Reviewers)',
          },
        ],
        originalCredits: [
          'Written by Mae West',
        ],
      },
    },
  },
  {
    title: 'Next Fall',
    projectKey: JCD_PROJECT_ENUM.NEXT_FALL,
    coverImageUri: 'nextfall.jpg',
    projectPage: {
      route: 'next-fall',
      galleryImageUris: [
        'nextfall/nextfall1.jpg',
        'nextfall/nextfall2.jpg',
        'nextfall/nextfall3.jpg',
        'nextfall/nextfall4.jpg',
        'nextfall/nextfall5.jpg',
        'nextfall/nextfall6.jpg',
        'nextfall/nextfall7.jpg',
        'nextfall/nextfall8.jpg',
        'nextfall/nextfall9.jpg',
        'nextfall/nextfall10.jpg',
      ],
      projectDetails: {
        org: 'An Other Theater Company',
        month: 5,
        year: 2018,
        credit: 'scenic & properties design',
        credits: [
          'Directed by Kacey Spadafora',
          'Scenic Painting by Janice Chan & Cynthia Chan',
          'Lighting Design by Paige Porter',
          'Costume Design by Ash Knowles',
          'Production Photography by Laura Chapman',
        ],
        mediaAndPress: [
          {
            description: '“Janice Chan’s set design is also simple, but beautiful. Various locations are specified by changing the paintings on the wall and rearranging the furniture. Large geometric patterns in rich colors cover the back wall, creating a pleasing backdrop for the action.”',
            link: {
              label: 'Humor and Heartbreak in An Other Theater Company\'s Next Fall',
              uri: 'https://frontrowreviewersutah.com/?p=7596',
            },
            publication: '(Front Row Reviewers)',
          },
        ],
        originalCredits: [
          'Written by Geoffrey Nauffts',
        ],
      },
    },
  },
  {
    title: 'Agamemnon',
    projectKey: JCD_PROJECT_ENUM.AGAMEMNON,
    coverImageUri: 'agamemnon.jpg',
    projectPage: {
      route: 'agamemnon',
      galleryImageUris: [
        'agamemnon/agamemnon1.jpg',
        'agamemnon/agamemnon2.jpg',
        'agamemnon/agamemnon3.jpg',
        'agamemnon/agamemnon4.jpg',
        'agamemnon/agamemnon5.jpg',
        'agamemnon/agamemnon6.jpg',
        'agamemnon/agamemnon7.jpg',
        'agamemnon/agamemnon8.jpg',
        'agamemnon/agamemnon9.jpg',
        'agamemnon/agamemnon10.jpg',
        'agamemnon/agamemnon11.jpg',
        'agamemnon/agamemnon12.jpg',
        'agamemnon/agamemnon13.jpg',
        'agamemnon/agamemnon14.jpg',
      ],
      projectDetails: {
        org: 'Utah Valley University',
        month: 4,
        year: 2018,
        credit: 'scenic design',
        credits: [
          'Directed by Christopher Clark',
          'Properties Design by Aimee Moore',
          'Lighting Design by Aaron Gubler',
          'Costume Design by Mallory Goodman',
          'Production Photography by Deric Lambdin',
        ],
        mediaAndPress: [],
        originalCredits: [
          'Written by Aeschylus',
        ],
      },
    },
  },
  {
    title: 'Tribes',
    projectKey: JCD_PROJECT_ENUM.TRIBES,
    coverImageUri: 'tribes.jpg',
    projectPage: {
      route: 'tribes',
      galleryImageUris: [
        'tribes/tribes1.jpg',
        'tribes/tribes2.jpg',
        'tribes/tribes3.jpg',
        'tribes/tribes4.jpg',
        'tribes/tribes5.jpg',
        'tribes/tribes6.jpg',
        'tribes/tribes7.jpg',
        'tribes/tribes8.jpg',
        'tribes/tribes9.jpg',
        'tribes/tribes10.jpg',
        'tribes/tribes11.jpg',
        'tribes/tribes12.jpg',
        'tribes/tribes13.jpg',
        'tribes/tribes14.jpg',
      ],
      projectDetails: {
        org: 'Utah Valley University',
        month: 1,
        year: 2018,
        credit: 'scenic design',
        credits: [
          'Directed by Hayley Lambdin',
          'Properties Design by McKenzie Kiser',
          'Lighting Design by Aaron Gubler',
          'Costume Design by Molly Pack',
          'Production Photography by Deric Lambdin',
        ],
        mediaAndPress: [],
        originalCredits: [
          'Written by Nina Raine',
        ],
      },
    },
  },
  {
    title: 'Fat Pig',
    projectKey: JCD_PROJECT_ENUM.FAT_PIG,
    coverImageUri: 'fatpig.jpg',
    projectPage: {
      route: 'fat-pig',
      galleryImageUris: [
        'fatpig/fatpig1.jpg',
        'fatpig/fatpig2.jpg',
        'fatpig/fatpig3.jpg',
        'fatpig/fatpig4.jpg',
        'fatpig/fatpig5.jpg',
        'fatpig/fatpig6.jpg',
        'fatpig/fatpig7.jpg',
        'fatpig/fatpig8.jpg',
        'fatpig/fatpig9.jpg',
        'fatpig/fatpig10.jpg',
        'fatpig/fatpig11.jpg',
        'fatpig/fatpig12.jpg',
      ],
      projectDetails: {
        org: 'An Other Theater Company',
        month: 1,
        year: 2018,
        credit: 'scenic & properties design',
        credits: [
          'Directed by Morag Shepherd',
          'Lighting Design by Paige Porter',
          'Costume Design by Chris Lancaster',
          'Production Photography by Laura Chapman',
        ],
        mediaAndPress: [
          {
            link: {
              label: 'Come Eat (and Face) Your Feelings at An Other Theater Company\'s Fat Pig',
              uri: 'https://frontrowreviewersutah.com/?p=6118'
            },
            publication: '(Front Row Reviewers)'
          },
        ],
        originalCredits: [
          'Written by Neil Labute',
        ],
      },
    },
  },
  {
    title: 'A Year with Frog and Toad',
    projectKey: JCD_PROJECT_ENUM.UVU,
    coverImageUri: 'utahvalleyuniversity.jpg',
    projectPage: {
      route: 'a-year-with-frog-and-toad',
      galleryImageUris: [
        'uvu/uvu1.jpg',
        'uvu/uvu2.jpg',
        'uvu/uvu3.jpg',
        'uvu/uvu4.jpg',
        'uvu/uvu5.jpg',
        'uvu/uvu6.jpg',
        'uvu/uvu7.jpg',
        'uvu/uvu8.jpg',
        'uvu/uvu9.jpg',
        'uvu/uvu10.jpg',
        'uvu/uvu11.jpg',
        'uvu/uvu12.jpg',
        'uvu/uvu13.jpg',
        'uvu/uvu14.jpg',
      ],
      projectDetails: {
        org: 'Utah Valley University',
        month: 11,
        year: 2017,
        credit: 'assistant scenic design',
        credits: [
          'Directed by Dr. Lisa Hall',
          'Technical Direction by Cristian Bell',
          'Scenic Design by Emma Belnap',
          'Properties Design by Alicia Freeman',
          'Lighting Design by Aaron Gubler',
          'Costume Design by Chris Lancaster',
          'Production Photography by Jeremy Hall',
        ],
        mediaAndPress: [],
        originalCredits: [
          'Book by Willie Reale',
          'Music & Lyrics by Robert Reale & Willie Reale',
        ],
      },
    },
  },
  {
    title: 'Joseph and the Amazing Technicolor Dreamcoat',
    projectKey: JCD_PROJECT_ENUM.SUNDANCE,
    coverImageUri: 'sundancesummertheatre.jpg',
    projectPage: {
      route: 'joseph-and-the-amazing-technicolor-dreamcoat',
      galleryImageUris: [
        'sundance/sundance1.jpg',
        'sundance/sundance2.jpg',
        'sundance/sundance3.jpg',
        'sundance/sundance4.jpg',
        'sundance/sundance5.jpg',
        'sundance/sundance6.jpg',
        'sundance/sundance7.jpg',
        'sundance/sundance8.jpg',
        'sundance/sundance9.jpg',
        'sundance/sundance10.jpg',
        'sundance/sundance11.jpg',
      ],
      projectDetails: {
        org: 'Sundance Summer Theatre',
        month: 7,
        year: 2017,
        credit: 'scenic painting',
        credits: [
          'Directed by D. Terry Petrie',
          'Technical Direction by Cristian Bell',
          'Scenic Design by Stephen Purdy',
          'Properties Design by McKenzie Kiser',
          'Lighting Design by Matthew Taylor',
          'Costume Design by Nancy Cannon & Carla Summers',
          'BTS Photography by Janice Chan',
        ],
        mediaAndPress: [
          {
            link: {
              label: 'Live Drama in Robert Redford\'s Backyard',
              uri: 'https://www.parkcitymag.com/arts-and-culture/2017/06/live-drama-in-robert-redfords-backyard',
            },
            publication: '(Park City Magazine)',
          },
        ],
        originalCredits: [
          'Music by Andrew Lloyd Webber',
          'Lyrics by Tim Rice',
        ],
      },
    },
  },
  {
    title: 'Cabaret',
    projectKey: JCD_PROJECT_ENUM.CABARET,
    coverImageUri: 'cabaret.jpg',
    projectPage: {
      route: 'cabaret',
      galleryImageUris: [
        'cabaret/cabaret1.jpg',
        'cabaret/cabaret2.jpg',
        'cabaret/cabaret3.jpg',
        'cabaret/cabaret4.jpg',
        'cabaret/cabaret5.jpg',
        'cabaret/cabaret6.jpg',
        'cabaret/cabaret7.jpg',
      ],
      projectDetails: {
        org: 'Utah Valley University',
        month: 4,
        year: 2018,
        credit: 'assistant scenic & properties design',
        credits: [
          'Directed by Robert Moffat',
          'Technical Direction by Cristian Bell',
          'Scenic Design by Madeline Ashton',
          'Properties Design by Madeline Ashton',
          'Lighting Design by Emma Belnap',
          'Costume Design by Carolyn Urban',
          'Hair & Makeup Design by Shelby Gist',
          'Production Photography by Jeremy Hall',
        ],
        mediaAndPress: [
          {
            link: {
              label: 'CABARET Scintillates at Utah Valley University',
              uri: 'https://www.broadwayworld.com/salt-lake-city/article/BWW-Review-CABARET-Scintillates-at-Utah-Valley-University-20180416',
            },
            publication: '(BroadwayWorld Review)'
          },
          {
            link: {
              label: 'Cabaret at UVU Shows the Genuine Behind the Decadence',
              uri: 'https://frontrowreviewersutah.com/?p=7363',
            },
            publication: '(Front Row Reviewers)'
          },
        ],
        originalCredits: [
          'Book by Joe Masteroff',
          'Music by John Kander',
          'Lyrics by Fred Ebb ',
        ],
      },
    },
  },
];
