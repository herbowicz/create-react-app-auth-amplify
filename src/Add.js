import { useContext, useRef, useState } from 'react';
import AppContext from './AppContext';
import { useHistory } from 'react-router-dom'
import { DataStore } from '@aws-amplify/datastore';
import Storage from "@aws-amplify/storage";
import { Box, Button, Container, Flex, FormControl, Heading, Textarea } from '@chakra-ui/react';

import { TimelineItem } from './models';

export default function Add() {
    const [description, setDescription] = useState('');
    const [source, setSource] = useState('');
    const user = useContext(AppContext);
    const history = useHistory();
    const fileRef = useRef();

    const onProcessFile = e => {
        e.preventDefault();
        const reader = new FileReader();
        const file = e.target.files[0];
        const fileName = file?.name;

        try {
            reader.readAsDataURL(file);
        } catch (err) {
            console.log(err);
        }

        reader.onloadend = () => setSource(reader.result);
        Storage.put(fileName, file)
            .then(async result => {
                const url = `http://d2m7yuqj2jn2cq.cloudfront.net/${fileName}`; // await Storage.get(result.key);
                console.log(url);
                setSource(url);
            })
            .catch(err => console.log(err));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        const now = new Date();
        await DataStore.save(
            new TimelineItem(
                {
                    id: String(Date.parse(now)),
                    description,
                    postTime: now.toISOString().split(':')[0] + ':' + now.toISOString().split(':')[1] + 'Z',
                    source,
                    author: {
                        id: user.username,
                        username: user.attributes.name,
                        profilePic: '',
                    }
                }
            )
        );
        setDescription('');
        history.push('/');
    }


    return (
        <Container>
            <Box
                maxW='lg'
                overflow='hidden'
                mx={2} my={5}
            >
                <Heading mb={5}>Add</Heading>
                <h3>Add a new post to the Timeline!</h3>
                <FormControl>
                    <Textarea placeholder="What's up?" onChange={e => setDescription(e.currentTarget.value)} />
                </FormControl>

                <input
                    type="file"
                    onChange={onProcessFile}
                    ref={fileRef}
                    hidden={true}
                />
                <Flex>
                    <Button onClick={() =>fileRef.current.click()}>Add picture or video</Button>
                    <Button onClick={e => handleSubmit(e)}>Submit</Button>
                </Flex>

            </Box>
        </Container>
    );
}