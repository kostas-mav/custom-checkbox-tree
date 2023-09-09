import { Neat } from 'src/app/shared/checkbox-tree/utils/types';

export const MULTI_LEVEL_DATA: Neat[] = [
  {
    id: '1',
    name: 'Technology',
    children: [
      {
        id: '1.1',
        name: 'Computers',
        children: [
          {
            id: '1.1.1',
            name: 'Operating Systems',
            children: [
              {
                id: '1.1.1.1',
                name: 'Linux',
              },
              {
                id: '1.1.1.2',
                name: 'MacOS',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: '2',
    name: 'Sports',
    children: [
      {
        id: '2.1',
        name: 'Sportswear',
        children: [
          {
            id: '2.1.1',
            name: 'Adidas',
          },
        ],
      },
    ],
  },
  {
    id: '3',
    name: 'DIY',
    children: [
      {
        id: '3.1',
        name: 'Power Tools',
        children: [
          {
            id: '3.1.1',
            name: 'Makita',
          },
        ],
      },
    ],
  },
  {
    id: '4',
    name: 'Outdoors',
    children: [
      {
        id: '4.1',
        name: 'Hiking',
        children: [
          {
            id: '4.1.1',
            name: 'Nike',
          },
        ],
      },
    ],
  },
  {
    id: '5',
    name: 'Office',
    children: [
      {
        id: '5.1',
        name: 'Office Chairs',
        children: [
          {
            id: '5.1.1',
            name: 'Herman Miller',
          },
        ],
      },
    ],
  },
  {
    id: '6',
    name: 'Clothing',
    children: [
      {
        id: '6.1',
        name: 'Jackets',
        children: [
          {
            id: '6.1.1',
            name: 'The North Face',
          },
          {
            id: '6.1.2',
            name: 'Patagonia',
          },
        ],
      },
    ],
  },
  {
    id: '7',
    name: 'Cooking',
    children: [
      {
        id: '7.1',
        name: 'Cookware',
        children: [
          {
            id: '7.1.1',
            name: 'Calphalon',
          },
        ],
      },
    ],
  },
  {
    id: '8',
    name: 'Baby',
    children: [
      {
        id: '8.1',
        name: 'Cribs',
        children: [
          {
            id: '8.1.1',
            name: 'IKEA',
          },
        ],
      },
    ],
  },
  {
    id: '9',
    name: 'Gaming',
    children: [
      {
        id: '9.1',
        name: 'Tabletop Gaming',
        children: [
          {
            id: '9.1.1',
            name: 'Dungeons & Dragons',
          },
        ],
      },
    ],
  },
];
