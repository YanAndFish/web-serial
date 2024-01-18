import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import unocss from 'unocss/vite'
import autoImport from 'unplugin-auto-import/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), unocss(), autoImport({
    dirs: [],
    dts: true,
    imports: [
      'react',
      {
        from: '@radix-ui/themes',
        imports: [
          'Theme',
          'ThemePanel',
          'Box',
          'Flex',
          'Grid',
          'Container',
          'Section',
          'AspectRatio',
          'Inset',
          'Heading',
          'Text',
          'Code',
          'Em',
          'Kbd',
          'Quote',
          'Strong',
          'Checkbox',
          'RadioGroup',
          'RadioGroupRoot',
          'RadioGroupItem',
          'Select',
          'SelectRoot',
          'SelectTrigger',
          'SelectContent',
          'SelectItem',
          'SelectGroup',
          'SelectLabel',
          'SelectSeparator',
          'Slider',
          'Switch',
          'TextArea',
          'TextField',
          'TextFieldRoot',
          'TextFieldSlot',
          'TextFieldInput',
          'Dialog',
          'DialogRoot',
          'DialogTrigger',
          'DialogContent',
          'DialogTitle',
          'DialogDescription',
          'DialogClose',
          'AlertDialog',
          'AlertDialogRoot',
          'AlertDialogTrigger',
          'AlertDialogContent',
          'AlertDialogTitle',
          'AlertDialogDescription',
          'AlertDialogAction',
          'AlertDialogCancel',
          'DropdownMenu',
          'DropdownMenuRoot',
          'DropdownMenuTrigger',
          'DropdownMenuContent',
          'DropdownMenuLabel',
          'DropdownMenuItem',
          'DropdownMenuGroup',
          'DropdownMenuRadioGroup',
          'DropdownMenuRadioItem',
          'DropdownMenuCheckboxItem',
          'DropdownMenuSub',
          'DropdownMenuSubTrigger',
          'DropdownMenuSubContent',
          'DropdownMenuSeparator',
          'ContextMenu',
          'ContextMenuRoot',
          'ContextMenuTrigger',
          'ContextMenuContent',
          'ContextMenuLabel',
          'ContextMenuItem',
          'ContextMenuGroup',
          'ContextMenuRadioGroup',
          'ContextMenuRadioItem',
          'ContextMenuCheckboxItem',
          'ContextMenuSub',
          'ContextMenuSubTrigger',
          'ContextMenuSubContent',
          'ContextMenuSeparator',
          'HoverCard',
          'HoverCardRoot',
          'HoverCardTrigger',
          'HoverCardContent',
          'Popover',
          'PopoverRoot',
          'PopoverTrigger',
          'PopoverContent',
          'PopoverClose',
          'Tooltip',
          'Avatar',
          'Badge',
          'Blockquote',
          'Button',
          'Callout',
          'CalloutRoot',
          'CalloutIcon',
          'CalloutText',
          'Card',
          'IconButton',
          'Link',
          'ScrollArea',
          'Separator',
          'Table',
          'TableRoot',
          'TableHeader',
          'TableRow',
          'TableBody',
          'TableColumnHeaderCell',
          'TableRowHeaderCell',
          'TableCell',
          'Tabs',
          'TabsRoot',
          'TabsList',
          'TabsTrigger',
          'TabsContent',
          'AccessibleIcon',
          'Portal',
          'Slot',
          'Slottable',
          'VisuallyHidden',
        ],
      },
    ],
  }),
  ],
})