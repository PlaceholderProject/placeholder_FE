import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ScheduleDetailSkeleton = () => (
  <div className="py-[2rem] md:py-[2.6rem]">
    <div className="mx-auto w-[calc(100%-3.2rem)] max-w-[64rem]">
      <Skeleton height="2rem" width="8rem" borderRadius="999px" />

      <section className="border-border bg-card mt-[1.3rem] overflow-hidden rounded-[2.2rem] border">
        <div className="aspect-square">
          <Skeleton height="100%" borderRadius="0" containerClassName="block h-full" />
        </div>
        <div className="p-[2rem]">
          <div className="flex gap-[0.7rem]">
            <Skeleton height="2.6rem" width="6rem" borderRadius="999px" />
            <Skeleton height="2.6rem" width="20rem" borderRadius="999px" />
          </div>
          <Skeleton height="3rem" width="42%" borderRadius="1rem" className="mt-[1rem]" />
          <Skeleton height="1.5rem" width="64%" borderRadius="1rem" className="mt-[0.7rem]" />
          <Skeleton height="1.7rem" width="100%" borderRadius="999px" className="mt-[1.6rem]" />
          <Skeleton height="1.7rem" width="76%" borderRadius="999px" className="mt-[0.7rem]" />
        </div>
      </section>
    </div>
  </div>
);

export default ScheduleDetailSkeleton;
