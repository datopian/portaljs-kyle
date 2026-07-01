import {
  BanknotesIcon,
  ShieldCheckIcon,
  PhoneIcon,
  BoltIcon,
  WrenchScrewdriverIcon,
  TruckIcon,
  BuildingOffice2Icon,
  SunIcon,
  BuildingStorefrontIcon,
  UsersIcon,
  ComputerDesktopIcon,
  ScaleIcon,
  DocumentTextIcon,
  MapIcon,
  BuildingLibraryIcon,
  FolderIcon,
} from '@heroicons/react/24/outline'
import type { ComponentType, SVGProps } from 'react'

type Icon = ComponentType<SVGProps<SVGSVGElement>>

// Map a CKAN org (department) name to a representative icon. Falls back to a folder.
const ICONS: Record<string, Icon> = {
  finance: BanknotesIcon,
  'police-department': ShieldCheckIcon,
  '311-customer-service': PhoneIcon,
  'utility-billing': BoltIcon,
  'public-works': WrenchScrewdriverIcon,
  transportation: TruckIcon,
  'planning-and-development-services': BuildingOffice2Icon,
  'parks-and-recreation': SunIcon,
  'economic-development': BuildingStorefrontIcon,
  'human-resources': UsersIcon,
  'information-technology': ComputerDesktopIcon,
  'municipal-court': ScaleIcon,
  'city-secretary-office': DocumentTextIcon,
  'enterprise-gis': MapIcon,
  'city-of-kyle-tx': BuildingLibraryIcon,
}

export function deptIcon(namespace: string): Icon {
  return ICONS[namespace] || FolderIcon
}
