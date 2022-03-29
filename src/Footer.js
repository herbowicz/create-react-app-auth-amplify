import {useState, useEffect, useCallback} from 'react';
import {useContext} from 'react';
import AppContext from './AppContext';
import {DataStore} from '@aws-amplify/datastore';
import {Box, IconButton, Text} from '@chakra-ui/react';
import { StarIcon, ChatIcon, ExternalLinkIcon } from '@chakra-ui/icons';

import ModalComment from './ModalComment';
import {Comment} from './models';

export default function Footer ({postTime, postId}) {
    const h = (Date.now() - Date.parse(postTime)) / 3600000;
    const days = Math.floor(h / 24);
    const hours = Math.floor(h % 24);
    const howOld = (days > 0 ? `${days} DAY${days > 1 ? 'S' : ''}` : '') + (hours > 0 && days < 60 ? ` ${hours} HOUR${hours > 1 ? 'S' : ''}` : '') + ' AGO';

    const [comments, setComments] = useState([]);
    const [open, setOpen] = useState(false);
    const user = useContext(AppContext);

    const getComments = useCallback(async () => {
        const postComments = (await DataStore.query(Comment)).filter(p => p.timelineitemID === postId);
        setComments(postComments);
    }, [postId]);

    useEffect(() => {
        getComments();
        const subscription = DataStore.observe(Comment).subscribe(() => getComments());
        return () => subscription.unsubscribe();
    }, [getComments]);

    async function createComment(comment) {
        await DataStore.save(
            new Comment({
                body: comment,
                user: {
                    id: user.username,
                    username: user.attributes.name,
                },
                timelineitemID: postId
            }));
        getComments();
        setOpen(false);
    }

    return (
        <Box ml={3}>
            <Box>
                <IconButton icon={<StarIcon />} variant='ghost' />
                <IconButton icon={<ChatIcon />} variant='ghost' onClick={() => setOpen(true)} />
                <IconButton icon={<ExternalLinkIcon />} variant='ghost' />
            </Box>

            <ModalComment createComment={createComment} open={open} setOpen={setOpen} />

            <Box>
                {comments.map(comment => (
                    <Text key={comment.id}>
                        <Text as='b'>{comment.user.username} </Text>
                        {comment.body}
                    </Text>
                ))}
            </Box>
            <Box mt={1} mb={2}>
                <Text fontSize='xs' color='gray.500'>
                    {h < .25 ? 'A MOMENT AGO' : h < 1 ? 'LESS THAN AN HOUR AGO' : howOld}
                </Text>
            </Box>
        </Box>
    );
};