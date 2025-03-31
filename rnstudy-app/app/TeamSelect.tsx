import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const teams = [
  { id: 1, name: 'SSG 랜더스', emoji: '🚀' },
  { id: 2, name: '두산 베어스', emoji: '🐻' },
  { id: 3, name: '키움 히어로즈', emoji: '🦸' },
  { id: 4, name: 'LG 트윈스', emoji: '👬' },
  { id: 5, name: 'KT 위즈', emoji: '🧙‍♂️' },
  { id: 6, name: 'NC 다이노스', emoji: '🦕' },
  { id: 7, name: '삼성 라이온즈', emoji: '🦁' },
  { id: 8, name: '롯데 자이언츠', emoji: '🦍' },
  { id: 9, name: 'KIA 타이거즈', emoji: '🐯' },
  { id: 10, name: '한화 이글스', emoji: '🦅' },
];

export default function TeamSelect() {
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);

  const handleTeamSelect = (teamId: number) => {
    setSelectedTeam(teamId);
  };

  const handleConfirm = () => {
    if (selectedTeam) {
      const selectedTeamData = teams.find((team) => team.id === selectedTeam);
      console.log('Selected team:', selectedTeamData?.name);
      // TODO: 선택된 팀 정보를 저장하는 로직 추가
      router.replace('/(tabs)');
    }
  };

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <View className='flex-1 px-5 py-8'>
        <Text className='text-2xl font-bold text-center mb-8'>
          팀을 선택해주세요
        </Text>
        <View className='flex-row flex-wrap justify-between gap-4'>
          {teams.map((team, index) => (
            <View
              key={team.id}
              className={`w-[30%] items-center mb-2 ${
                index === teams.length - 1 ? 'mx-auto' : ''
              }`}
            >
              <TouchableOpacity
                className={`aspect-square w-[85%] rounded-full border justify-center items-center ${
                  selectedTeam === team.id
                    ? 'border-2 border-blue-500 bg-blue-50'
                    : 'border border-gray-300'
                }`}
                onPress={() => handleTeamSelect(team.id)}
              >
                <Text className='text-3xl'>{team.emoji}</Text>
              </TouchableOpacity>
              <Text className='text-sm mt-1 text-center font-medium'>
                {team.name}
              </Text>
            </View>
          ))}
        </View>
        <TouchableOpacity
          className={`mt-auto mb-4 py-4 rounded-xl ${
            selectedTeam ? 'bg-blue-500' : 'bg-gray-400'
          }`}
          onPress={handleConfirm}
          disabled={!selectedTeam}
        >
          <Text className='text-white text-center text-lg font-semibold'>
            확인
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
