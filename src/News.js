import {useState, useEffect, useCallback} from 'react';
import {DataStore, Predicates, SortDirection} from 'aws-amplify';
import {Container} from '@chakra-ui/react';
import {Box} from '@chakra-ui/react';

import Header from './Header';
import Main from './Main';
import Footer from './Footer';

import {TimelineItem} from './models';

export default function News() {
    const  [timeline, setTimeline] = useState([]);

    const getTimeline = useCallback(async () => {
        setTimeline(await DataStore.query(TimelineItem, Predicates.ALL, {
            sort: s => s.postTime(SortDirection.DESCENDING)
        }));
    }, []);

    async function del(postId) {
        DataStore.delete(await DataStore.query(TimelineItem, postId));
    }

    useEffect(() => {
        getTimeline();
        const subscription = DataStore.observe(TimelineItem).subscribe(() => getTimeline());
        return () => subscription.unsubscribe();
    }, [getTimeline]);

    return (
        <Container>
            {timeline.map((post, i) => (
                <Box key={i}
                    maxW='lg'
                    borderWidth='1px'
                    borderRadius='md'
                    overflow='hidden'
                    mx={2} my={5}
                >
                    <Header author={post.author} postId={post.id} del={del} />
                    <Main
                        description={post.description}
                        source={post.source}
                    />
                    <Footer
                        postTime={post.postTime}
                        postId={post.id}
                    />
                </Box>
            ))}
        </Container>
    );
}