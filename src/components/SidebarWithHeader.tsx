import {
    Box,
    BoxProps,
    Button,
    CloseButton,
    Drawer,
    DrawerContent,
    Flex,
    FlexProps,
    HStack,
    Icon,
    IconButton,
    Link,
    Text,
    useColorModeValue,
    useDisclosure,
    VStack,
} from '@chakra-ui/react';
import { ReactNode, useCallback } from 'react';
import { IconType } from 'react-icons';
import {
    FiCalendar,
    FiCloudLightning,
    FiHome,
    FiMenu,
    FiShield,
    FiUsers,
    FiZap,
} from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';

interface LinkItemProps {
    name: string;
    icon: IconType;
    route: string;
}
const LinkItems: Array<LinkItemProps> = [
    { name: 'Home', icon: FiHome, route: '/' },
    { name: 'Player Overview', icon: FiUsers, route: '/playerOverview' },
    { name: 'Champion Overview', icon: FiShield, route: '/championOverview' },
    { name: 'Match History', icon: FiCalendar, route: '/matchHistory' },
    { name: 'Matchmaker', icon: FiZap, route: '/matchmaker' },
    { name: 'Team Builder', icon: FiCloudLightning, route: '/teamBuilder' },
];

export default function SidebarWithHeader({
    children,
}: {
    children: ReactNode;
}) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
        <Box minH='100vh'>
            <SidebarContent
                onClose={() => onClose}
                display={{ base: 'none', md: 'block' }}
            />
            <Drawer
                autoFocus={false}
                isOpen={isOpen}
                placement='left'
                onClose={onClose}
                returnFocusOnClose={false}
                onOverlayClick={onClose}
                size='full'
            >
                <DrawerContent>
                    <SidebarContent onClose={onClose} />
                </DrawerContent>
            </Drawer>
            {/* mobilenav */}
            <MobileNav onOpen={onOpen} />
            <Box ml={{ base: 0, md: 60 }} p='4'>
                {children}
            </Box>
        </Box>
    );
}

interface SidebarProps extends BoxProps {
    onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
    return (
        <Box
            transition='3s ease'
            borderRight='1px'
            borderRightColor={useColorModeValue('gray.200', 'gray.700')}
            w={{ base: 'full', md: 60 }}
            pos='fixed'
            h='full'
            {...rest}
        >
            <Flex h='20' align='center' mx='8' justify='space-between'>
                <Flex direction='column' justify='center' align='center'>
                    <Text
                        fontSize='2xl'
                        fontWeight='bold'
                        textTransform='uppercase'
                        color='gray.600'
                    >
                        MNC Hub
                    </Text>
                    <Text fontSize='10px' alignSelf={'flex-end'}>
                        Alpha
                    </Text>
                </Flex>
                <CloseButton
                    display={{ base: 'flex', md: 'none' }}
                    onClick={onClose}
                />
            </Flex>
            <VStack spacing='24px' align='stretch' justify='flex-start'>
                {LinkItems.map((link) => (
                    <NavItem
                        key={link.name}
                        icon={link.icon}
                        route={link.route}
                        onClose={onClose}
                        label={link.name}
                    ></NavItem>
                ))}
            </VStack>
        </Box>
    );
};

interface NavItemProps extends FlexProps {
    key: string;
    icon: IconType;
    label: string;
    route: string;
    onClose: () => void;
}

const NavItem = ({ icon, label, route, onClose }: NavItemProps) => {
    const location = useLocation();
    const navigate = useNavigate();
    const isSelected = () => {
        return location.pathname === route;
    };

    const onClick = useCallback(() => {
        navigate(route);
        onClose();
    }, [route, navigate, onClose]);

    return (
        <Link style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }}>
            <Flex direction='column'>
                <Button
                    leftIcon={<Icon as={icon}></Icon>}
                    onClick={onClick}
                    variant={isSelected() ? 'solid' : 'ghost'}
                    size='lg'
                    borderRadius='0'
                    justifyContent='flex-start'
                >
                    <Text>{label}</Text>
                </Button>
            </Flex>
        </Link>
    );
};

interface MobileProps extends FlexProps {
    onOpen: () => void;
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
    return (
        <Flex
            ml={{ base: 0, md: 60 }}
            px={{ base: 4, md: 4 }}
            height='20'
            align='center'
            borderBottomWidth='1px'
            borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
            justify={{ base: 'space-between', md: 'flex-end' }}
            {...rest}
        >
            <IconButton
                display={{ base: 'flex', md: 'none' }}
                onClick={onOpen}
                variant='outline'
                aria-label='open menu'
                icon={<FiMenu />}
            />

            <Box display={{ base: 'flex', md: 'none' }}>
                <Flex direction='column' justify='center' align='center'>
                    <Text
                        fontSize='2xl'
                        fontFamily='monospace'
                        fontWeight='bold'
                        textTransform='uppercase'
                        color='gray.600'
                    >
                        MNC Hub
                    </Text>
                    <Text fontSize='10px' alignSelf={'flex-end'}>
                        Alpha
                    </Text>
                </Flex>
            </Box>

            <HStack spacing={{ base: '0', md: '6' }}>
                {/* <IconButton
          size="lg"
          variant="ghost"
          aria-label="open menu"
          icon={<FiBell />}
        />
        <Flex alignItems={'center'}>
          <Menu>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: 'none' }}>
              <HStack>
                <Avatar
                  size={'sm'}
                  src={
                    'https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9'
                  }
                />
                <VStack
                  display={{ base: 'none', md: 'flex' }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2">
                  <Text fontSize="sm">No User Signed In</Text>
                  <Text fontSize="xs" color="gray.600">
                    Sign In
                  </Text>
                </VStack>
                <Box display={{ base: 'none', md: 'flex' }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue('white', 'gray.900')}
              borderColor={useColorModeValue('gray.200', 'gray.700')}>
              <MenuItem>Profile</MenuItem>
              <MenuItem>Settings</MenuItem>
              <MenuDivider />
              <MenuItem>Sign out</MenuItem>
            </MenuList>
          </Menu>
        </Flex> */}
            </HStack>
        </Flex>
    );
};
