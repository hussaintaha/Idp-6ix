import { Link, Toast, Frame, IndexTable, Card, useIndexResourceState, Button, Layout, Page, TextField } from '@shopify/polaris';
import { useState, useEffect, useCallback } from 'react';

const KeyPage = () => {

    const [value, setValue] = useState('');
    const handleChange = useCallback((newValue) => setValue(newValue), []);


    return (
        <>
            <div>
                <Page fullWidth>
                    <Layout>
                        <Layout.Section>
                            <Card
                                sectioned
                                title="Connection Settings"
                            >
                                <div>
                                    <TextField
                                        label="Store name"
                                        value={value}
                                        onChange={handleChange}
                                        autoComplete="off"
                                    />
                                    <br />
                                    <Button primary>Send</Button>
                                </div>
                            </Card>
                        </Layout.Section>
                    </Layout>
                </Page>
            </div>
        </>
    )
};

export default KeyPage;