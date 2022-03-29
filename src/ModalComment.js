import {useState} from 'react';
import {
    Button,
    FormControl,
    Textarea,
    Modal,
    ModalBody,
    ModalOverlay,
    ModalContent,
    ModalFooter} from '@chakra-ui/react';

export default function ModalComment ({createComment, open, setOpen}) {
    const [comment, setComment] = useState('');

    return (
        <Modal isOpen={open}>
            <ModalOverlay />
            <ModalContent>
                <ModalBody pt={5}>
                    <FormControl>
                        <Textarea placeholder="Your comment" onChange={e => setComment(e.currentTarget.value)} />
                    </FormControl>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={() => createComment(comment)}>
                        Add
                    </Button>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}