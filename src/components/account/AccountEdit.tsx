"use client";

import { BASE_URL } from "@/constants/baseURL";
import { useEditUser, useUser } from "@/hooks/useUser";
import { checkNickname } from "@/services/auth.service";
import { RootState } from "@/stores/store";
import { setUser } from "@/stores/userSlice";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaCog } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";

const AccountEdit = () => {
  const [profileImage, setProfileImage] = useState<string>("");
  const [nickname, setNickname] = useState("");
  const [nicknameWarning, setNicknameWarning] = useState("");
  const [bio, setBio] = useState("");
  const [bioTextLength, setBioTextLength] = useState(0);
  const [bioWarning, setBioWarning] = useState("");

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const { data, isLoading } = useUser();

  const editUserMutation = useEditUser();

  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();

  const router = useRouter();

  useEffect(() => {
    if (!user.email) {
      const fetchUser = async () => {
        if (data) {
          dispatch(
            setUser({
              email: data.email,
              nickname: data.nickname,
              bio: data.bio,
              profileImage: data.image,
            }),
          );
          setProfileImage(data.image || "/profile.png");
        }
      };
      fetchUser();
    } else {
      if (user.profileImage) {
        const imagePath = user.profileImage.startsWith("http") ? user.profileImage : `${BASE_URL}${user.profileImage}`;
        setProfileImage(imagePath);
      } else {
        setProfileImage("/profile.png");
      }
      setNickname(user.nickname || "");
      setBio(user.bio || "");
    }
  }, []);

  if (!data) return;

  const handleProfileImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setProfileImage(objectUrl); // Blob URL을 React 상태에 설정
    }
  };

  const handleNicknameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length > 8) {
      setNicknameWarning("닉네임은 최소 2자 최대 8자까지 가능합니다.");
    } else {
      setNicknameWarning("");
    }
    setNickname(event.target.value);
  };

  const handleBioChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (event.target.value.length > 40) {
      setBioWarning("자기소개는 최대 40자까지 작성이 가능합니다.");
      return;
    } else {
      setBioWarning("");
    }
    setBio(event.target.value);
    setBioTextLength(event.target.value.length);
  };

  const handleCheckNickname = async () => {
    if (nickname === user.nickname) {
      alert("사용 가능한 닉네임입니다.");
      return;
    }
    if (!nickname.trim()) {
      alert("닉네임을 입력해주세요.");
      return;
    }
    if (nickname.length < 2 || nickname.length > 8) {
      alert("닉네임은 최소 2자 최대 8자까지 가능합니다.");
      return;
    }
    await checkNickname(nickname);
  };

  const handleAccountEditFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!nickname.trim()) {
      alert("닉네임을 입력해주세요.");
      return;
    }
    if (nickname.length < 2 || nickname.length > 8) {
      alert("닉네임은 최소 2자 최대 8자까지 가능합니다.");
      return;
    }

    const file = fileInputRef.current?.files?.[0];

    const editedUser = {
      nickname,
      bio,
      profileImage: file || null,
    };

    try {
      const response = await editUserMutation.mutateAsync(editedUser);

      if (response) {
        const imageUrl = response.image ? (response.image.startsWith("http") ? response.image : `${BASE_URL}${response.image}`) : null;

        dispatch(
          setUser({
            email: response.email,
            nickname: response.nickname,
            bio: response.bio,
            profileImage: imageUrl,
          }),
        );

        setProfileImage(imageUrl);
        alert("회원 정보가 변경되었습니다.");
        router.replace("/account");
      }
    } catch (error) {
      alert("이미 사용 중인 닉네임입니다. 닉네임 중복을 확인해주세요.");
      console.error("Update failed:", error);
    }
  };

  if (isLoading) return <div>로딩중</div>;

  return (
    <div>
      <div className="flex flex-col items-center">
        <h2 className="">회원 정보 수정</h2>
        <div className="border-2 flex flex-col items-center rounded-xl">
          <form onSubmit={handleAccountEditFormSubmit}>
            <div>
              <div className="w-[200px] h-[200px] rounded-full relative bg-slate-300 overflow-hidden">
                <Image src={profileImage ? profileImage : "/profile.png"} alt="프로필 이미지" fill className="object-cover" />
              </div>

              <label htmlFor="profileImage" className="cursor-pointer rounded-full">
                <FaCog size={20} />
                <input
                  type="file"
                  id="profileImage"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleProfileImageChange}
                  className="hidden" // 숨김 처리
                />
              </label>
            </div>

            <div className="flex flex-col">
              <label htmlFor="nickname">닉네임</label>
              <input type="text" value={nickname} onChange={handleNicknameChange} className="border-2 rounded-md" />
              <button type="button" onClick={handleCheckNickname}>
                중복확인
              </button>
              {nicknameWarning && <p>{nicknameWarning}</p>}
            </div>
            <div className="flex flex-col">
              <label htmlFor="bio">자기소개</label>
              <textarea value={bio} onChange={handleBioChange} placeholder="함께할 모임원을 위해 간단한 자기소개를 작성해주세요." className="border-2 rounded-md" />
              {bioWarning && <p>{bioWarning}</p>}
              <p>{bioTextLength}/40</p>
            </div>
            <button type="submit">변경하기</button>
          </form>
          <div>
            <Link href="/account">취소하기</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountEdit;
