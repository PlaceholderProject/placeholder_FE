export interface Schedule {
  id: number;
  meetup_id: number;
  scheduled_at: string;
  place: string;
  address: string;
  latitude: number;
  longitude: number;
  memo: string;
  image?: string; //NOT NULL이기 때문에
  created_at?: string;
  updated_at?: string; //created_at과 updated_at은 서버에서 자동 생성되는 필드이기 때문에 임시로 옵셔널
}

// 더미 데이터를 위한 타입 생성
export interface ScheduleLocation {
  place: string;
  address: string;
  latitude: number;
  longitude: number;
}

// 더미 데이터 임시로 types 폴더에 저장
export const DUMMY_LOCATIONS: ScheduleLocation[] = [
  {
    place: "별다방 강남R점",
    address: "서울 강남구 강남대로 390",
    latitude: 37.4976,
    longitude: 127.0284,
  },
  {
    place: "롯데월드타워",
    address: "서울 송파구 올림픽로 300",
    latitude: 37.5126,
    longitude: 127.1025,
  },
];
