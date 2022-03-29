import { useContext } from 'react';
import AppContext from './AppContext';
import {Avatar, Box, Flex, IconButton, Spacer, Text, Tooltip} from '@chakra-ui/react';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import {BrowserRouter as Router, Link} from "react-router-dom";

export default function Header ({author, del, postId}) {
    const user = useContext(AppContext);

    const edit = () => console.log('edit');

    return (
        <Box p={2}>
            <Router>
                <Flex>
                    <Link to="/profile">
                        <Box d='flex' alignItems='center'>
                            <Avatar
                                name={author.username}
                                src={author.profilePic}
                            />
                            <Box ml={2}>
                                <Text fontWeight='bold' fontSize='sm'>
                                    {author.username}
                                </Text>
                            </Box>
                        </Box>
                    </Link>
                    <Spacer />
                    {author.username === user.attributes?.name && (
                        <Box p={2}>
                        <Tooltip label="Delete" aria-label="Delete">
                            <IconButton icon={<DeleteIcon />} variant='ghost' onClick={() => del(postId)} />  
                        </Tooltip>
                        <Tooltip label="Edit" aria-label="Edit">
                            <IconButton icon={<EditIcon />} onClick={() => edit()} />
                        </Tooltip>
                        </Box>
                    )}
                </Flex>
            </Router>
        </Box>
    );
};