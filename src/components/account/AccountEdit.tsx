"use client";

import { useEditUser, useUser } from "@/hooks/useUser";
import { checkNickname } from "@/services/auth.service";
import { RootState } from "@/stores/store";
import { setUser } from "@/stores/userSlice";
import { resizeImage } from "@/utils/resizeImage";
import { getImageURL } from "@/utils/getImageURL";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { LuArrowLeft, LuCamera, LuMail, LuPenLine, LuSave, LuUserRound } from "react-icons/lu";
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
    if (data && !user.email) {
      dispatch(
        setUser({
          email: data.email,
          nickname: data.nickname,
          bio: data.bio,
          profileImage: data.image,
        }),
      );
    }

    const nextEmail = user.email || data?.email;
    if (!nextEmail) return;

    const nextNickname = user.nickname ?? data?.nickname ?? "";
    const nextBio = user.bio ?? data?.bio ?? "";
    const nextImage = user.profileImage ?? data?.image ?? "";

    setProfileImage(nextImage ? getImageURL(nextImage) : "/profile.png");
    setNickname(nextNickname);
    setBio(nextBio);
    setBioTextLength(nextBio.length);
  }, [data, dispatch, user.bio, user.email, user.nickname, user.profileImage]);

  const handleProfileImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setProfileImage(objectUrl);
    }
  };

  const handleNicknameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextNickname = event.target.value;
    if (nextNickname.length > 8 || (nextNickname.length > 0 && nextNickname.length < 2)) {
      setNicknameWarning("닉네임은 2자 이상 8자 이하로 입력해주세요.");
    } else {
      setNicknameWarning("");
    }
    setNickname(nextNickname);
  };

  const handleBioChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (event.target.value.length > 40) {
      setBioWarning("자기소개는 최대 40자까지 작성할 수 있어요.");
      return;
    }
    setBioWarning("");
    setBio(event.target.value);
    setBioTextLength(event.target.value.length);
  };

  const handleCheckNickname = async () => {
    if (nickname === (user.nickname ?? data?.nickname)) {
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
      const resizedBlob = await resizeImage(file, 300, 300);
      resizedFile = new File([resizedBlob], file.name, { type: file.type });
    }

    const editedUser = {
      nickname,
      bio,
      profileImage: resizedFile,
    };

    try {
      const response = await editUserMutation.mutateAsync(editedUser);

      if (response) {
        const imageUrl = response.image ? getImageURL(response.image) : null;

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

  if (isLoading && !user.email) {
    return (
      <div className="mx-auto w-[95%] max-w-[58rem] py-[3rem]">
        <div className="bg-muted h-[24rem] animate-pulse rounded-[2rem]" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-[95%] max-w-[58rem] space-y-[1.8rem] py-[2.4rem] md:py-[3.2rem]">
      <Link href="/account" className="text-muted-foreground hover:text-foreground inline-flex items-center gap-[0.5rem] text-sm font-semibold transition-colors">
        <LuArrowLeft className="h-[1.5rem] w-[1.5rem] stroke-[1.9]" />
        계정 관리
      </Link>

      <div>
        <h1 className="text-foreground text-2xl font-bold">회원 정보 수정</h1>
        <p className="text-muted-foreground mt-[0.5rem] text-sm">프로필과 모임원에게 보이는 소개를 관리해요.</p>
      </div>

      <form onSubmit={handleAccountEditFormSubmit} className="space-y-[1.6rem]">
        <section className="border-border bg-card flex flex-col items-center rounded-[2rem] border p-[2rem]">
          <div className="relative">
            <div className="relative h-[10rem] w-[10rem] overflow-hidden rounded-full">
              <Image unoptimized src={profileImage || "/profile.png"} alt="프로필 이미지" fill sizes="10rem" className="object-cover" />
            </div>
            <label
              htmlFor="profileImage"
              className="bg-primary text-primary-foreground ring-card absolute right-0 bottom-0 grid h-[3.4rem] w-[3.4rem] cursor-pointer place-items-center rounded-full ring-[0.4rem]"
            >
              <LuCamera className="h-[1.6rem] w-[1.6rem] stroke-[2]" />
              <input type="file" id="profileImage" accept="image/*" ref={fileInputRef} onChange={handleProfileImageChange} className="hidden" />
            </label>
          </div>
        </section>

        <section className="border-border bg-card space-y-[1.4rem] rounded-[2rem] border p-[1.8rem] md:p-[2rem]">
          <div>
            <label htmlFor="nickname" className="text-foreground mb-[0.7rem] block text-sm font-semibold">
              닉네임
            </label>
            <div className="flex gap-[0.7rem]">
              <div className="border-border focus-within:border-primary flex h-[4.6rem] min-w-0 flex-1 items-center gap-[0.9rem] rounded-[1.4rem] border px-[1.3rem] transition-colors">
                <LuUserRound className="text-muted-foreground h-[1.7rem] w-[1.7rem] stroke-[1.8]" />
                <input id="nickname" type="text" value={nickname} onChange={handleNicknameChange} className="min-w-0 flex-1 bg-transparent text-sm outline-none" />
              </div>
              <button
                type="button"
                onClick={handleCheckNickname}
                className="bg-primary-soft text-primary h-[4.6rem] shrink-0 rounded-[1.4rem] px-[1.2rem] text-sm font-semibold transition hover:opacity-80"
              >
                확인
              </button>
            </div>
            {nicknameWarning && <p className="text-warning mt-[0.6rem] text-xs font-medium">{nicknameWarning}</p>}
          </div>

          <div>
            <label className="text-foreground mb-[0.7rem] block text-sm font-semibold">이메일</label>
            <div className="border-border bg-muted/50 flex h-[4.6rem] items-center gap-[0.9rem] rounded-[1.4rem] border px-[1.3rem]">
              <LuMail className="text-muted-foreground h-[1.7rem] w-[1.7rem] stroke-[1.8]" />
              <span className="text-muted-foreground min-w-0 truncate text-sm">{user.email || data?.email}</span>
            </div>
          </div>

          <div>
            <label htmlFor="bio" className="text-foreground mb-[0.7rem] block text-sm font-semibold">
              소개
            </label>
            <div className="border-border focus-within:border-primary flex min-h-[9rem] items-start gap-[0.9rem] rounded-[1.4rem] border px-[1.3rem] py-[1.2rem] transition-colors">
              <LuPenLine className="text-muted-foreground mt-[0.2rem] h-[1.6rem] w-[1.6rem] stroke-[1.8]" />
              <textarea
                id="bio"
                value={bio}
                onChange={handleBioChange}
                placeholder="함께할 모임원을 위해 간단한 자기소개를 작성해주세요."
                className="min-h-[6.4rem] min-w-0 flex-1 resize-none bg-transparent text-sm leading-relaxed outline-none"
              />
            </div>
            <div className="mt-[0.6rem] flex justify-between gap-[1rem]">
              {bioWarning ? <p className="text-warning text-xs font-medium">{bioWarning}</p> : <span />}
              <p className="text-muted-foreground text-xs">{bioTextLength}/40</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={editUserMutation.isPending}
            className="bg-primary text-primary-foreground flex h-[4.8rem] w-full items-center justify-center gap-[0.7rem] rounded-[1.4rem] text-sm font-semibold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-55"
          >
            <LuSave className="h-[1.6rem] w-[1.6rem] stroke-[2]" />
            {editUserMutation.isPending ? "저장 중" : "프로필 저장"}
          </button>
        </section>
      </form>
    </div>
  );
};

export default AccountEdit;
