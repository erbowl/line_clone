class Room < ApplicationRecord
  has_many :chats
  has_many :room_users
  has_many :users,through: :room_users

  def self.get_room_by_users(user_ids)
    room=User.find(user_ids[0]).rooms.map{|e|
      if (user_ids - e.user_ids).empty? && (e.user_ids - user_ids).empty?
        e
      end
    }.compact[0]

    if room.blank?
      room=Room.create()
      room.users<<User.where(id:user_ids)
    end

    return room
  end
end
