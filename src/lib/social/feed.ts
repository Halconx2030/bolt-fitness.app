import { prisma } from '@/lib/prisma';

export class SocialFeed {
  static async getUserFeed(userId: number) {
    return prisma.activity.findMany({
      where: {
        OR: [
          { userId },
          {
            userId: {
              in: await this.getFollowedUserIds(userId)
            }
          }
        ]
      },
      include: {
        user: true,
        comments: true,
        likes: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 20
    });
  }

  static async getFollowedUserIds(userId: number) {
    const follows = await prisma.follows.findMany({
      where: { followerId: userId },
      select: { followingId: true }
    });
    return follows.map(f => f.followingId);
  }
} 