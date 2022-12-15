
import { JcdV3Project } from '../../models/jcd-models-v3/jcd-v3-project';
import { JCD_V3_PROJECT_ENUM } from './jcd-v3-project-enum';

export const JCD_V3_PROJECT_BASES: JcdV3Project[] = [
  {
    projectKey: JCD_V3_PROJECT_ENUM.THE_TALES_OF_HOFFMANN,
    route: 'the-tales-of-hoffmann',
    title: 'Les contes d’Hoffmann',
    playwright: [
      'Opéra Fantastique by Jacques Offenbach',
    ],
    venue: 'Smith Theatre',
    producer: 'The Noorda Center for the Performing Arts',
    month: 11,
    year: 2022,
    description: [
      'The scenic design for The Tales of Hoffmann showcased the themes of perception and distortion, with recurring circular motifs. Rooted in fantasy, each story presented in the opera was stylistically heightened through the strong use of colour. Fragments of realism and time periods were shown through the presentation of props and set dressing. Several weeks prior to load-in, the design budget was reduced by 75%, resulting in the loss of significant set pieces.',
    ],
    productionCredits: [
      'Directed by Isaac Hurtado',
      'Conducted by Nicolas Giusti',
      'Technical Direction by Eric Kiekhaefer',
      'Scenic & Props Design by Janice Chan',
      'Lighting Design by Peter D. Leonard',
      'Costume, Hair, & Makeup Design by Jennessa Law',
      'Production Photography by Michelle Fitzwater',
    ],
    mediaAndPress: [],
  },
  {
    projectKey: JCD_V3_PROJECT_ENUM.LARAMIE_PROJECT,
    route: 'the-laramie-project',
    title: 'The Laramie Project',
    playwright: [
      'Written by Moisés Kaufman & the members of the Tectonic Theater Project',
    ],
    venue: 'Bastian Theatre',
    producer: 'The Noorda Center for the Performing Arts',
    month: 1,
    year: 2019,
    description: [
      'This unique production featured an immersive audience experience as viewers travelled across the entire set, led by the cast. Immersed in the action and events of the play, audience members were confronted with the true retelling of the tragic death of Matthew Shepard. Surrounded by the stylised and unconventional design, themes of reflection, isolation, community, and hope were presented in each room.',
      'Janice’s scenic design was awarded Best Scenic Design by the Theatre Arts Guild at Utah Valley University in 2019. Her concept and show design were presented at the BFA Theatrical Design Student Showcase in 2019. In the same year, she presented a panel at the Conference on Writing for Social Change at Utah Valley University alongside the production assistant director, Shelby Gist, and dramaturg, Matthew Oviatt.',
    ],
    productionCredits: [
      'Directed by Laurie Harrop-Purser',
      'Technical Direction by Cristian Bell',
      'Scenic & Props Design by Janice Chan',
      'Lighting Design by Colin Skip Wilson',
      'Projection Design by Emma Eugenia Belnap',
      'Sound Design by Nathan Lowry',
      'Costume Design by Rae Sip & Kate Backman',
      'Makeup Design by Alanna Cottam',
      'Production Photography by Suzy Oliveira',
    ],
    mediaAndPress: [
      {
        publication: '(UVU Review)',
        description: '“Set designer Janice Chan orchestrated this in a way that seemingly transported the audience to another place.”',
        link: {
          label: '\'Laramie Project\' Asks Audiences to Examine Relationship to LGBT Community',
          uri: 'https://www.uvureview.com/news/front-page/recent/review-laramie-project-asks-audiences-to-examine-relationship-to-lgbtq-community/',
        },
      },
      {
        publication: '(ABC4 News)',
        link: {
          label: 'UVU Play About Matthew Shepard Highlights Utah\'s Lack of Hate Crime Protections for LGBTQ',
          uri: 'https://www.abc4.com/news/local-news/uvu-play-about-matthew-shepard-highlights-utahs-lack-of-hate-crime-protections-for-lgbtq/',
        },
      },
    ],
  }
];

// TEMPLATE
const _template: JcdV3Project = {
  projectKey: '',
  route: '',
  title: '',
  playwright: [
    '',
  ],
  venue: '',
  producer: '',
  month: -1,
  year: -1,
  description: [
    '',
  ],
  productionCredits: [
    '',
  ],
  mediaAndPress: [
    {
      publication: '',
      description: '',
      link: {
        label: '',
        uri: '',
      },
    },
  ],
};
