"use client";

import { BASE_URL } from "@/constants/baseURL";
import { useEditUser, useUser } from "@/hooks/useUser";
import { checkNickname } from "@/services/auth.service";
import { RootState } from "@/stores/store";
import { setUser } from "@/stores/userSlice";
import { resizeImage } from "@/utils/resizeImage";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaCog } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const AccountEdit = () => {
  const [profileImage, setProfileImage] = useState<string | null>("");
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
        const imagePath = user.profileImage.startsWith("http") ? user.profileImage : `${BASE_URL}/${user.profileImage}`;
        setProfileImage(imagePath);
      } else {
        setProfileImage("/profile.png");
      }
      setNickname(user.nickname || "");
      setBio(user.bio || "");
    }
  }, [data, dispatch, user.bio, user.email, user.nickname, user.profileImage]);

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
      toast.success("사용 가능한 닉네임입니다.");
      return;
    }
    if (!nickname.trim()) {
      toast.error("닉네임을 입력해주세요.");
      return;
    }
    if (nickname.length < 2 || nickname.length > 8) {
      toast.error("닉네임은 최소 2자 최대 8자까지 가능합니다.");
      return;
    }
    await checkNickname(nickname);
  };

  const handleAccountEditFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!nickname.trim()) {
      toast.error("닉네임을 입력해주세요.");
      return;
    }
    if (nickname.length < 2 || nickname.length > 8) {
      toast.error("닉네임은 최소 2자 최대 8자까지 가능합니다.");
      return;
    }

    const file = fileInputRef.current?.files?.[0];
    let resizedFile: File | null = null;

    if (file) {
      const resizedBlob = await resizeImage(file, 300, 300); // 예: 최대 300x300
      resizedFile = new File([resizedBlob], file.name, { type: file.type });
    }

    const editedUser = {
      nickname,
      bio,
      profileImage: resizedFile, // 리사이징된 파일 사용
    };

    try {
      const response = await editUserMutation.mutateAsync(editedUser);

      if (response) {
        const imageUrl = response.image ? (response.image.startsWith("http") ? response.image : `${BASE_URL}/${response.image}`) : null;

        dispatch(
          setUser({
            email: response.email,
            nickname: response.nickname,
            bio: response.bio,
            profileImage: imageUrl,
          }),
        );

        setProfileImage(imageUrl);
        toast.success("회원 정보가 변경되었습니다.");
        router.replace("/account");
      }
    } catch (error) {
      toast.error("이미 사용 중인 닉네임입니다. 닉네임 중복을 확인해주세요.");
      console.error("Update failed:", error);
    }
  };

  if (isLoading) return <div>로딩중</div>;

  return (
    <div>
      <div className="my-[4rem] flex min-h-[calc(100vh-12rem)] flex-col items-center justify-center md:min-h-[calc(100vh-13.5rem)]">
        <h2 className="mb-[2rem] text-3xl font-semibold">회원 정보 수정</h2>
        <div className="flex h-full min-h-[54rem] w-[80%] min-w-[30rem] flex-col items-center justify-center gap-[3rem] rounded-[1.5rem] border-[0.1rem] border-gray-medium py-[2rem] md:max-w-[80rem]">
          <form onSubmit={handleAccountEditFormSubmit} className="flex flex-col justify-center gap-[1.5rem] p-[2rem]">
            <div className="relative flex items-center justify-center">
              <div className="relative h-[15rem] w-[15rem] overflow-hidden rounded-full">
                <Image src={profileImage ? profileImage : "/profile.png"} alt="프로필 이미지" fill className="object-cover" />
              </div>
              <label htmlFor="profileImage" className="absolute bottom-0 right-20 flex h-[3rem] w-[3rem] cursor-pointer items-center justify-center rounded-full bg-primary text-2xl text-white">
                <FaCog />
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
            <div>
              <div className="flex flex-col">
                <label htmlFor="nickname" className="text-lg font-semibold">
                  닉네임
                </label>
                <div>
                  <input type="text" value={nickname} onChange={handleNicknameChange} className="h-[4rem] w-[18rem] rounded-l-[1rem] border-[0.1rem] border-gray-medium px-[1rem]" />
                  <button
                    type="button"
                    onClick={handleCheckNickname}
                    className="h-[4rem] w-[6rem] rounded-r-[1rem] border-y-[0.1rem] border-r-[0.1rem] border-gray-medium bg-gray-light hover:bg-gray-medium"
                  >
                    중복확인
                  </button>
                  {nicknameWarning && <p className="mt-[0.3rem] w-[24rem] text-sm text-warning">{nicknameWarning}</p>}
                </div>
              </div>
              <div className="flex flex-col">
                <label htmlFor="bio" className="text-lg font-semibold">
                  자기소개
                </label>
                <div>
                  <textarea
                    value={bio}
                    onChange={handleBioChange}
                    placeholder="함께할 모임원을 위해 간단한 자기소개를 작성해주세요."
                    className="h-[7rem] w-[24rem] rounded-[1rem] border-[0.1rem] border-gray-medium p-[1rem]"
                  />
                  {bioWarning && <p className="mt-[0.3rem] w-[24rem] text-sm text-warning">{bioWarning}</p>}
                  <div className="flex w-full justify-end">
                    <p className="mt-[0.3rem] text-sm">{bioTextLength}/40</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-[0.8rem]">
              <button type="submit" disabled={editUserMutation.isPending} className="flex h-[4rem] w-[24rem] items-center justify-center rounded-[1rem] bg-secondary-dark text-lg">
                변경하기
              </button>
              <Link href="/account">
                <div className="flex h-[4rem] w-[24rem] items-center justify-center rounded-[1rem] bg-gray-light text-lg">취소하기</div>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AccountEdit;
