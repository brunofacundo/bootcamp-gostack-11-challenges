import React, { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import api from './services/api';

export default function App() {
    const [repositories, setRepositories] = useState([]);

    useEffect(() => {
        (async () => {
            const { data } = await api.get('/repositories');
            setRepositories(data);
        })();
    }, []);

    async function handleLikeRepository(id) {
        const { data } = await api.post(`/repositories/${id}/like`);
        setRepositories(
            repositories.map(repository => {
                if (repository.id == id) {
                    return data;
                }

                return repository;
            })
        );
    }

    return (
        <>
            <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
            <SafeAreaView style={styles.container}>
                <FlatList
                    data={repositories}
                    keyExtractor={repository => repository.id}
                    renderItem={({ item: repository }) => (
                        <View style={styles.repositoryContainer}>
                            <Text style={styles.repository}>{repository.title}</Text>

                            <View style={styles.techsContainer}>
                                {repository.techs.map(tech => (
                                    <Text key={tech} style={styles.tech}>
                                        {tech}
                                    </Text>
                                ))}
                            </View>

                            <Text style={styles.likeText} testID={`repository-likes-${repository.id}`}>
                                {`${repository.likes} curtida${repository.likes > 0 ? 's' : ''}`}
                            </Text>

                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => handleLikeRepository(repository.id)}
                                testID={`like-button-${repository.id}`}>
                                <Text style={styles.buttonText}>Curtir</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#7159c1'
    },
    repositoryContainer: {
        marginBottom: 15,
        marginHorizontal: 15,
        backgroundColor: '#fff',
        padding: 20
    },
    repository: {
        fontSize: 32,
        fontWeight: 'bold'
    },
    techsContainer: {
        flexDirection: 'row',
        marginTop: 10
    },
    tech: {
        fontSize: 12,
        fontWeight: 'bold',
        marginRight: 10,
        backgroundColor: '#04d361',
        paddingHorizontal: 10,
        paddingVertical: 5,
        color: '#fff'
    },
    likeText: {
        marginTop: 15,
        fontSize: 14,
        fontWeight: 'bold'
    },
    button: {
        marginTop: 10,
        backgroundColor: '#7159c1',
        padding: 15
    },
    buttonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#fff'
    }
});
