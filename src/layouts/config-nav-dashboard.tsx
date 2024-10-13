import { Label } from 'src/components/label';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.svg`} />
);

export const navData = [
  {
    title: 'Dashboard Links',
    path: '/dashboard',
    icon: icon('ic-analytics'),
  },
  {
    title: 'Patient Data',
    path: '/patient',
    icon: icon('ic-user'),
  },
  {
    title: 'Approvals',
    path: '/approvals',
    icon: icon('ic-lock'),
  }
];


// {
//   title: 'Product',
//       path: '/products',
//     icon: icon('ic-cart'),
//     info: (
//     <Label color="error" variant="inverted">
//       +3
//     </Label>
// ),
// },
// {
//   title: 'Blog',
//       path: '/blog',
//     icon: icon('ic-blog'),
// },
// {
//   title: 'Sign in',
//       path: '/sign-in',
//     icon: icon('ic-lock'),
// },
// {
//   title: 'Not found',
//       path: '/404',
//     icon: icon('ic-disabled'),
// },